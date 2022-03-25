/* eslint-disable @typescript-eslint/consistent-type-imports */

interface Exposed {
  readonly openExternal: typeof import('./src/openExternal').openExternal;
  readonly redisApi: Readonly<typeof import('./src/redis-api').redisApi>;
  readonly fsApi: Readonly<typeof import('./src/fs-api').fsApi>;
  readonly utilApi: Readonly<typeof import('./src/util-api').utilApi>;
  readonly prettyBytes: Readonly<typeof import('pretty-bytes').default>;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {
}
