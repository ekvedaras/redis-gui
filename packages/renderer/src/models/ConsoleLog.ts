export default class ConsoleLog {
  public content: string | object;
  public isError = false;
  public wasSent = false;

  constructor(content: string | object) {
    this.content = content
  }
}
