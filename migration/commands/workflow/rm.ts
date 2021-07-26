import chalk from 'chalk'
import { deleteWorkflow } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import {
  issue,
  wait,
  wrap,
  stamp,
  label,
  header,
  param,
  date,
  bool
} from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Delete a workflow.')}

  ${chalk.dim('Usage:')}
  
    workflow rm [options] 

  ${chalk.dim('Options:')}

    -i, --id                                     Workflow ID
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
      '-i': '--id'
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--id'] === undefined) {
    output.error('You must provide a workflow ID.')
    return 1
  }

  const stopSpinner = wait('Removing workflow')
  const addStamp = stamp()

  try {
    await deleteWorkflow(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  output.log(
    `Workflow ${param(argv['--id'])} removed ${chalk.gray(addStamp())}`
  )
  output.print('\n')

  return 0
}
