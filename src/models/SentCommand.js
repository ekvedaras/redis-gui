import { ConsoleLog } from '@/models/ConsoleLog'

export class SentCommand extends ConsoleLog {
  constructor (command) {
    super(command)
    this.wasSent = true
  }
}
