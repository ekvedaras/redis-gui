declare module 'redis-ssh' {
  import type {SshConfig} from '/packages/renderer/src/use/database'
  import type {RedisClient} from 'redis'

  type ServerConfig = {
    host: string
    port: number
    password: string
  }

  type RedisSshConnection = {
    client: RedisClient,
    close: () => void,
  }

  interface RedisSshClient {
    connect: (sshConfig: SshConfig, redisConfig: ServerConfig) => Promise<RedisSshConnection>,
  }

  const RedisSsh: RedisSshClient

  export default RedisSsh;
}
