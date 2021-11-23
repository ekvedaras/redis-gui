interface Database {
  id: string,
  index: number,
  name?: string,

  [key: string]: unknown,
}
