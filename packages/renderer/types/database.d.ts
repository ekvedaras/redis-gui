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

export type Settings = {
  itemsPerPage: number,
  namespaceSeparator: string,
  leftPaneSize: string,
}

export type DatabaseSettings = {
  servers: Record<string, Server>,
  history: Record<string, Array<string>>,
  settings: Settings,
}
