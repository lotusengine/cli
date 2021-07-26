class LotusError extends Error {
  code: any;
  meta: any;
  constructor ({
    code,
    message,
    meta
  }: any) {
    super(message)
    this.code = code
    this.meta = meta
  }
}
export default LotusError
