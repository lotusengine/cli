import chalk from 'chalk'

export default async (label: any, options = {}) => {
  const {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultValue' does not exist on type '{}... Remove this comment to see the full error message
    defaultValue = false,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'abortSequences' does not exist on type '... Remove this comment to see the full error message
    abortSequences = new Set(['\u0003']),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'resolveChars' does not exist on type '{}... Remove this comment to see the full error message
    resolveChars = new Set(['\r']),
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'yesChar' does not exist on type '{}'.
    yesChar = 'y',
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'noChar' does not exist on type '{}'.
    noChar = 'n',
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'stdin' does not exist on type '{}'.
    stdin = process.stdin,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'stdout' does not exist on type '{}'.
    stdout = process.stdout,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'trailing' does not exist on type '{}'.
    trailing = ''
  } = options

  return new Promise(resolve => {
    const isRaw = Boolean(stdin.isRaw)

    if (stdin.setRawMode) {
      stdin.setRawMode(true)
    }

    stdin.resume()

    const restore = () => {
      stdout.write(trailing)

      if (stdin.setRawMode) {
        stdin.setRawMode(isRaw)
      }

      stdin.pause()
      stdin.removeListener('data', onData)
    }

    const onData = (buffer: any) => {
      const data = buffer.toString()
      if (data[0].toLowerCase() === yesChar) {
        restore()
        stdout.write('\n')
        resolve(true)
      } else if (data[0].toLowerCase() === noChar) {
        stdout.write('\n')
        restore()
        resolve(false)
      } else if (abortSequences.has(data)) {
        stdout.write('\n')
        restore()
        resolve(false)
      } else if (resolveChars.has(data[0])) {
        stdout.write('\n')
        restore()
        resolve(defaultValue)
      } else {
        // ignore extraneous input
      }
    }

    const defaultText =
      defaultValue === null
        ? `[${yesChar}|${noChar}]`
        : defaultValue
          ? `[${chalk.bold(yesChar.toUpperCase())}|${noChar}]`
          : `[${yesChar}|${chalk.bold(noChar.toUpperCase())}]`
    stdout.write(`${chalk.gray('>')} ${label} ${chalk.gray(defaultText)} `)
    stdin.on('data', onData)
  });
}
