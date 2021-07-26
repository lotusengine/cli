import chalk from 'chalk'
import { listServices } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, table, wait, wrap, stamp } from '../../lib/styles'
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/pluralize` if it exists or... Remove this comment to see the full error message
import plural from 'pluralize'
import strlen from '../../lib/strlen'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('List available services.')}

  ${chalk.dim('Usage:')}
  
    service ls      [options] 

`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {})
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  const stopSpinner = wait('Fetching services')
  const addStamp = stamp()
  let services
  try {
    services = await listServices()
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  output.log(
    `${plural('service', services.length, true)} found ${addStamp()}\n`
  )
  if (services.length > 0) {
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    table(['ID', 'Label', 'Created at'], services)
  }

  output.print('\n')
  return 0
}
