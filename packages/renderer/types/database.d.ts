export type SshConfig = {
  tunnel: boolean,
  host: string,
  port: number,
  user?: string,
  password?: string,
  privateKey?: string,
}

export type Server = {
  name: string,
  host: string,
  port: number,
  path?: string,
  url?: string,
  password?: string,
  ssh: SshConfig,
}

type ServerArray = {
  [key: string]: Server
}

type ArrayOfArrays = {
  [key: string]: Array<string>
}

export type Settings = {
  itemsPerPage: number,
  namespaceSeparator: string,
  leftPaneSize: string,
}

export type DatabaseSettings = {
  servers: ServerArray,
  history: ArrayOfArrays,
  settings: Settings,
}
