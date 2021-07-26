import chalk from 'chalk'
import { updateWorkflow } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Update a workflow.')}

  ${chalk.dim('Usage:')}
  
    workflow update [options] 

  ${chalk.dim('Options:')}

    -i, --id                                     Workflow ID
    -w, --definition                             Path to JSON definition file
    -l, --label                                  Optional label
    -d, --description                            Optional description
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
      '-i': '--id',
      '--definition': String,
      '-w': '--definition',
      '--description': String,
      '-d': '--description',
      '--label': String,
      '-l': '--label'
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

  const stopSpinner = wait('Updating workflow')
  const addStamp = stamp()

  try {
    await updateWorkflow(argv['--id'], {
      label: argv['--label'],
      description: argv['--description'],
      definition: argv['--definition']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${chalk.cyan('> Success!')} Workflow ${
      argv['--id']
    } updated. ${addStamp()}\n`
  )

  return 0
}
