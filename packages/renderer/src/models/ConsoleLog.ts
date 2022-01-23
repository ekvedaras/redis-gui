export default class ConsoleLog {
  public content: string | object;
  public isError: boolean = false;
  public wasSent: boolean = false;

  constructor(content: string | object) {
    this.content = content
  }
}
