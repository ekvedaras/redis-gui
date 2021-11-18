export type SshConfig = {
  tunnel: boolean,
  host: string,
  port: number,
  privateKey?: string,
}

export type Server = {
  name: string,
  host: string,
  port: number,
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
