// Execute stack code to obtain schema
export const loadStackSchema = async (stackPath: string) => {
  const { default: fn } = await import(stackPath)

  return fn()
}
