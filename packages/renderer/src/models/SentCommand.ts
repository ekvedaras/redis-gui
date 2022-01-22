import ConsoleLog from '/@/models/ConsoleLog'

export default class SentCommand extends ConsoleLog {
  constructor(command: string) {
    super(command)
    this.wasSent = true
  }
}
