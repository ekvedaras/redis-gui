import type {RedisClientOptions, RedisClientType} from '@redis/client'
import type {Client, ConnectConfig} from 'ssh2'
import {exposeInMainWorld} from './exposeInMainWorld';
import type {SshConfig} from '../../renderer/types/database'
import * as fs from 'node:fs'
import * as net from 'node:net'

export interface QueuedCommand {
  args: Array<string>
}

const SshClient = require('ssh2').Client
const redis = require('redis')

// type ServerConfig = {
//   host: string
//   port: number
//   password?: string
// }

export interface RedisExtension {
  isConnectionOpen(): boolean
}

export interface RedisApi {
  connectingTo: string,

  createClient(server: string, options?: RedisClientOptions): RedisClientType,

  createClientThroughSsh(server: string, sshOptions: SshConfig, redisOptions?: RedisClientOptions): Promise<RedisClientType>,

  test(options?: RedisClientOptions, onSuccess?: () => void, onError?: (error: string) => void): Promise<void>,

  testThroughSsh(sshOptions: SshConfig, redisOptions: RedisClientOptions, onSuccess?: () => void, onError?: (error: string) => void): Promise<void>,

  client: RedisClientType | RedisExtension
}

const connectToSsh = async (sshConfig: ConnectConfig): Promise<Client> => new Promise((resolve, reject) => {
  const sshConnection = new SshClient();

  sshConnection
    .on('ready', () => resolve(sshConnection))
    .on('error', reject)
    .connect(sshConfig);
})

const createProxyServer = async (sshConnection: Client, redisConfig: RedisClientOptions): Promise<net.Server> => new Promise((resolve, reject) => {
  const server = net.createServer((sock: net.Socket) => {
    const redisSocket = redisConfig.socket as net.TcpSocketConnectOpts
    sshConnection.forwardOut(
      sock.remoteAddress ?? '',
      sock.remotePort ?? 6379,
      redisSocket.host ?? '',
      redisSocket.port,
      (err, stream) => err
        ? sock.end()
        : sock.pipe(stream).pipe(sock),
    );
  });

  server
    .on('error', reject)
    .listen(0, () => resolve(server));
})

/**
 * contextBridge rebuilds an Error in the renderer without its message, so anything the renderer
 * needs to read has to cross as a primitive.
 */
const readable = (value: unknown): unknown => {
  // redis wraps socket failures in an AggregateError whose own message is empty.
  if (value instanceof AggregateError) {
    return value.errors.map(readable).join(', ')
  }

  return value instanceof Error ? value.message || String(value) : value
}

const rejectReadably = <T>(result: Promise<T>): Promise<T> => result.catch(error => Promise.reject(readable(error)))

const commandNames = (instance: object): Set<string> => {
  const names = new Set<string>()
  for (let proto = Object.getPrototypeOf(instance); proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto)) {
    Object.getOwnPropertyNames(proto).forEach(name => names.add(name))
  }
  return names
}

let client: RedisClientType;
let closeSshTunnel: (() => Promise<void>) | undefined;

const disconnect = async () => {
  try {
    if (closeSshTunnel) {
      await closeSshTunnel();
      closeSshTunnel = undefined
    }

    await client.disconnect()
  } catch {
    // ignore
  }
}

export const redisApi : RedisApi = {
  connectingTo: '',
  createClient: (server : string, options: RedisClientOptions) => {
    redisApi.connectingTo = server
    disconnect();

    if (options && 'socket' in options && options.socket) {
      options.socket.reconnectStrategy = (attempt: number) => {
        if (server !== redisApi.connectingTo) {
          return new Error(`Connection to ${server} aborted`)
        }

        return attempt < 10 ? 1000 : new Error(`Connection to ${server} failed`)
      }
    }

    return client = redis.createClient(options);
  },

  createClientThroughSsh: async (server: string, sshOptions: SshConfig, redisOptions: RedisClientOptions) => {
    redisApi.connectingTo = server
    disconnect();

    const _sshConfig = {
      ...sshOptions,
      ...(sshOptions.privateKey ? {privateKey: fs.readFileSync(sshOptions.privateKey)} : {}),
    }

    const sshConnection = await connectToSsh(_sshConfig)
    const proxyServer = await createProxyServer(sshConnection, redisOptions)

    client = redis.createClient({
      ...redisOptions,
      socket: {
        ...(redisOptions.socket ?? {}),
        reconnectStrategy: (attempt: number) => {
          if (server !== redisApi.connectingTo) {
            return new Error(`Connection to ${server} aborted`)
          }

          return attempt < 10 ? 1000 : new Error(`Connection to ${server} failed`)
        },
        host: (proxyServer.address() as net.AddressInfo).address,
        port: (proxyServer.address() as net.AddressInfo).port,
      },
    });

    closeSshTunnel = async () => {
      await client.quit()
      proxyServer.close()
      sshConnection.end()
    }

    return client
  },

  test: async (options, onSuccess, onError) => {
    const testClient = redis.createClient(options)

    testClient.on('ready', () => {
      testClient.quit()
      onSuccess?.()
    }).on('error', (error: unknown) => {
      testClient.quit()
      onError?.(String(readable(error)))
    })

    await testClient.connect()
  },

  testThroughSsh: async (sshOptions, redisOptions, onSuccess, onError) => {
    try {
      const sshConnection = await connectToSsh({
        ...sshOptions,
        ...(sshOptions.privateKey ? {privateKey: fs.readFileSync(sshOptions.privateKey)} : {}),
      })
      const proxyServer = await createProxyServer(sshConnection, redisOptions);

      const testClient = redis.createClient({
        ...redisOptions,
        socket: {
          ...(redisOptions.socket ?? {}),
          host: (proxyServer.address() as net.AddressInfo).address,
          port: (proxyServer.address() as net.AddressInfo).port,
        },
      });

      await testClient.connect()
      await testClient.quit()
      proxyServer.close()
      sshConnection.end()

      onSuccess?.()
    } catch (error) {
      onError?.(String(readable(error)))
    }
  },

  client: {
    isConnectionOpen: () => client?.isOpen ?? false,
    connect: () => client.connect(),
    select: (db: number) => client.select(db),
    quit: () => client.quit(),
    // @ts-ignore
    on: (event, listener) => {
      // @ts-ignore
      client.on(event, (...args) => listener(...args.map(readable)))
      return redisApi.client
    },
    // @ts-ignore
    sendCommand: (...args) => rejectReadably(client.sendCommand(...args)),
    multiExecutor: (commands: Array<QueuedCommand>) => rejectReadably(commands
      .reduce((multi, {args}) => multi.addCommand(args), client.multi())
      .exec()),
  },
};

// Command methods live on the prototype chain of the concrete client class redis builds at runtime,
// so a throwaway instance is the only way to enumerate them before any server is configured.
for (const method of commandNames(redis.createClient())) {
  // The walk also reaches EventEmitter, so it would clobber the hand-written wrappers above
  // (notably the chainable `on`) with ones that return the raw, non-cloneable client.
  if (method in redisApi.client) continue

  // @ts-ignore
  redisApi.client[method] = (...args) => rejectReadably(client[method](...args))
}

exposeInMainWorld('redisApi', redisApi)
