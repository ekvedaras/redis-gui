import type {RedisMultiQueuedCommand} from '@node-redis/client/dist/lib/multi-command'
import type {RedisCommandRawReply, RedisScripts} from '@node-redis/client/dist/lib/commands'
import type {RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client'
import RedisClient from '@node-redis/client/dist/lib/client'
import type {RedisApi} from '../types/redis-api'
import type {Client, ConnectConfig} from 'ssh2'

const fs = require('fs');
const net = require('net');
const SshClient = require('ssh2').Client;
const redis = require('redis')

const connectToSsh = async (sshConfig: ConnectConfig): Promise<Client> => new Promise((resolve, reject) => {
  const sshConnection = new SshClient();

  sshConnection
    .on('ready', () => resolve(sshConnection))
    .on('error', reject)
    .connect(sshConfig);
})

const createProxyServer = async <S extends RedisScripts = Record<string, never>>(sshConnection: Client, redisConfig: Omit<RedisClientOptions<never, S>, 'modules'>): Promise<typeof net.Server> => new Promise((resolve, reject) => {
  const server = net.createServer((sock: typeof net.Socket) => {
    sshConnection.forwardOut(sock.remoteAddress, sock.remotePort, redisConfig.socket.host, redisConfig.socket.port, (err, stream) => {
      if (err) {
        sock.end();
      } else {
        sock.pipe(stream).pipe(sock);
      }
    });
  });
  server.on('error', reject).listen(0, () => resolve(server));
})

let client: RedisClientType;
let closeSshTunnel: (() => void) | undefined;

export const redisApi: RedisApi = {
  createClient: (options) => {
    if (closeSshTunnel) {
      closeSshTunnel();
      closeSshTunnel = undefined
    }
    return client = redis.createClient(options);
  },

  createClientThroughSsh: async (sshOptions, redisOptions) => {
    if (closeSshTunnel) {
      closeSshTunnel();
      closeSshTunnel = undefined
    }

    const sshConnection = await connectToSsh({
      ...sshOptions,
      ...(sshOptions.privateKey ? {privateKey: fs.readFileSync(sshOptions.privateKey)} : {}),
    });
    const proxyServer = await createProxyServer(sshConnection, redisOptions);

    client = redis.createClient({
      ...redisOptions,
      socket: {
        ...(redisOptions.socket ?? {}),
        host: proxyServer.address().address,
        port: proxyServer.address().port,
      },
    });

    closeSshTunnel = () => {
      client.quit();
      proxyServer.close();
      sshConnection.end();
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
    isConnectionOpen: () => client.isOpen,
    connect: () => client.connect(),
    disconnect: () => {
      client.disconnect()

      if (closeSshTunnel) {
        closeSshTunnel();
        closeSshTunnel = undefined
      }
    },
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
