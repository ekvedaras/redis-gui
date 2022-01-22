export default class ConsoleLog {
  public content: string;
  public isError: boolean = false;
  public wasSent: boolean = false;

  constructor(content: string) {
    this.content = content
  }
}
