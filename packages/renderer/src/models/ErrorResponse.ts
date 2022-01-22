import ConsoleLog from '/@/models/ConsoleLog'

export default class ErrorResponse extends ConsoleLog {
  constructor(error: any) {
    super(error.toString())
    this.isError = true
  }
}
