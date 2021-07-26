import getArgs from './args'

export default async (sentry: any, error: any, clientId: any) => {
  sentry.withScope((scope: any) => {
    if (clientId) {
      scope.setTag('clientId', clientId)
    }

    // Report `process.argv` without sensitive data
    let args
    let argsError
    try {
      args = getArgs(process.argv.slice(2), {})
    } catch (err) {
      argsError = err
    }

    if (args) {
      // const flags = ['--env', '--build-env', '--token']
      // for (const flag of flags) {
      //   if (args[flag]) args[flag] = 'REDACTED'
      // }
      // if (
      //   args._.length >= 4 &&
      //   args._[0].startsWith('secret') &&
      //   args._[1] === 'add'
      // ) {
      //   args._[3] = 'REDACTED'
      // }
      scope.setExtra('args', args)
    } else {
      let msg = 'Unable to parse args'
      if (argsError) {
        msg += `: ${argsError}`
      }
      scope.setExtra('args', msg)
    }

    // Report information about the version of `node` being used
    scope.setExtra('node', {
      execPath: process.execPath,
      version: process.version,
      platform: process.platform
    })

    sentry.captureException(error)
  })

  const client = sentry.getCurrentHub().getClient()

  if (client) {
    await client.close()
  }
}
