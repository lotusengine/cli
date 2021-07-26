import chalk from 'chalk'
import { listWorkflows } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, table, wait, wrap, stamp } from '../../lib/styles'
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/pluralize` if it exists or... Remove this comment to see the full error message
import plural from 'pluralize'
import strlen from '../../lib/strlen'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('List available workflows.')}

  ${chalk.dim('Usage:')}
  
    workflow ls      [options] 

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

  const stopSpinner = wait('Fetching workflows')
  const addStamp = stamp()
  let workflows
  try {
    workflows = await listWorkflows()
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${plural('workflow', workflows.length, true)} found ${addStamp()}\n`
  )
  if (workflows.length > 0) {
    table(['ID', 'Label', 'Created at'], workflows)
  }

  output.print('\n')
  return 0
}
