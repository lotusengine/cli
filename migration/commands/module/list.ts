import chalk from 'chalk'
import { listModules } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, table, wait, wrap, end, stamp } from '../../lib/styles'
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/pluralize` if it exists or... Remove this comment to see the full error message
import plural from 'pluralize'
import strlen from '../../lib/strlen'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('List available modules.')}

  ${chalk.dim('Usage:')}
  
    module ls      [options] 

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

  const stopSpinner = wait('Fetching modules')
  const addStamp = stamp()
  let modules
  try {
    modules = await listModules()
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  output.log(`${plural('module', modules.length, true)} found ${addStamp()}\n`)
  if (modules.length > 0) {
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'never'.
    table(['ID', 'Label', 'Scope'], modules)
  }

  output.print(end())
  return 0
}
