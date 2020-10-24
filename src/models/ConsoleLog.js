export class ConsoleLog {
  constructor (content) {
    this.content = content
    this.isError = false
    this.wasSent = false
  }
}
