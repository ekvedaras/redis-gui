import { ConsoleLog } from '@/models/ConsoleLog'

export class ErrorResponse extends ConsoleLog {
  constructor (error) {
    super(error.toString())
    this.isError = true
  }
}
