import ConsoleLog from '/@/models/ConsoleLog'

export default class ErrorResponse extends ConsoleLog {
  constructor(error: unknown) {
    super(String(error))
    this.isError = true
  }
}
