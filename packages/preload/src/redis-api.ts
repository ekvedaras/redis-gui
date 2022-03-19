import type {RedisMultiQueuedCommand} from '@node-redis/client/dist/lib/multi-command'
import type {RedisCommandRawReply} from '@node-redis/client/dist/lib/commands'
import type {RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client'
import RedisClient from '@node-redis/client/dist/lib/client'
// import type {RedisApi} from '../types/redis-api'
import type {Client, ConnectConfig} from 'ssh2'
import {exposeInMainWorld} from './exposeInMainWorld';
// import type {SshConfig} from '../../renderer/types/database'
import * as fs from 'node:fs'
import * as net from 'node:net'

// const fs = require('fs');
// const net = require('net');
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

//
// export interface RedisApi {
//   connectingTo: string,
//
//   createClient(server: string, options?: RedisClientOptions): RedisClientType,
//
//   createClientThroughSsh(server: string, sshOptions: SshConfig, redisOptions?: RedisClientOptions): Promise<RedisClientType>,
//
//   test(options?: RedisClientOptions, onSuccess: () => void, onError: (error: string) => void): Promise<void>,
//
//   testThroughSsh(sshOptions: SshConfig, redisOptions?: RedisClientOptions, onSuccess: () => void, onError: (error: string) => void): Promise<void>,
//
//   client: RedisClient | RedisExtension
// }

const connectToSsh = async (sshConfig: ConnectConfig): Promise<Client> => new Promise((resolve, reject) => {
  const sshConnection = new SshClient();

  sshConnection
    .on('ready', () => resolve(sshConnection))
    .on('error', reject)
    .connect(sshConfig);
})

const createProxyServer = async (sshConnection: Client, redisConfig: RedisClientOptions<never, Record<string, never>>): Promise<typeof net.Server> => new Promise((resolve, reject) => {
  const server = net.createServer((sock: typeof net.Socket) => {
    const redisSocket = redisConfig.socket as typeof net.TcpSocketConnectOpts
    sshConnection.forwardOut(
      sock.remoteAddress,
      sock.remotePort,
      redisSocket.host,
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

let client: RedisClientType;
let closeSshTunnel: (() => Promise<void>) | undefined;

const disconnect = async () => {
  try {
    if (closeSshTunnel) {
      await closeSshTunnel();
      closeSshTunnel = undefined
    }

    await client.disconnect()
  } catch (e) {
    // ignore
  }
}

export const redisApi = {
  connectingTo: '',
  createClient: (server, options) => {
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

  createClientThroughSsh: async (server, sshOptions, redisOptions) => {
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
        host: proxyServer.address().address,
        port: proxyServer.address().port,
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
      onSuccess()
    }).on('error', (error: unknown) => {
      testClient.quit()
      onError(String(error))
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
          host: proxyServer.address().address,
          port: proxyServer.address().port,
        },
      });

      await testClient.connect()
      await testClient.quit()
      proxyServer.close()
      sshConnection.end()

      onSuccess()
    } catch (error) {
      onError(String(error))
    }
  },

  client: {
    isConnectionOpen: () => client?.isOpen ?? false,
    connect: () => client.connect(),
    select: (db: number) => client.select(db),
    quit: () => client.quit(),
    // @ts-ignore
    on: (...args) => {
      // @ts-ignore
      client.on(...args)
      return redisApi.client
    },
    // @ts-ignore
    sendCommand: (...args) => client.sendCommand(...args),
    multiExecutor: (commands: Array<RedisMultiQueuedCommand>, chainId?: symbol): Promise<Array<RedisCommandRawReply>> => client.multiExecutor(commands, chainId),
  },
};

for (const method of Object.keys(RedisClient.prototype)) {
  // @ts-ignore
  redisApi.client[method] = (...args) => client[method](...args)
}

exposeInMainWorld('redisApi', redisApi)
