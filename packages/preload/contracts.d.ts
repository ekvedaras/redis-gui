/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
  readonly nodeCrypto: Readonly<typeof import('./src/nodeCrypto').nodeCrypto>;
  readonly versions: Readonly<typeof import('./src/versions').versions>;
  readonly openExternal: Readonly<typeof import('./src/openExternal').openExternal>;
  readonly redisApi: Readonly<typeof import('./src/redis-api').redisApi>;
  readonly fsApi: Readonly<typeof import('./src/fs-api').fsApi>;
  readonly utilApi: Readonly<typeof import('./src/util-api').utilApi>;
  readonly prettyBytes: Readonly<typeof import('pretty-bytes').prettyBytes>;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {
}
