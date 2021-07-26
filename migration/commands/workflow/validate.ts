import chalk from 'chalk'
import { validateWorkflow } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Validate a workflow.')}

  ${chalk.dim('Usage:')}
  
    workflow validate [options] 

  ${chalk.dim('Options:')}

    -i, --id                                     Workflow ID
    -m, --mapping                                Path to JSON mapping file
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
      '--mapping': String,
      '-m': '--mapping',
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

  const stopSpinner = wait('Validating workflow')
  const addStamp = stamp()

  let valid
  try {
    valid = await validateWorkflow({
      id: argv['--id'],
      label: argv['--label'],
      description: argv['--description'],
      mapping: argv['--mapping']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  if (valid) { output.log(`Workflow ${argv['--label']} is valid. ${addStamp()}\n`) } else {
    output.log(
      `Workflow ${argv['--label']} is ${chalk.bold(
        'not'
      )} valid. ${addStamp()}\n`
    )
  }

  return 0
}
