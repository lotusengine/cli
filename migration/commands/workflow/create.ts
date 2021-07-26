import chalk from 'chalk'
import { createWorkflow } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Create a new workflow.')}

  ${chalk.dim('Usage:')}
  
    workflow create [options] 

  ${chalk.dim('Options:')}

    --serviceId                                  Service ID
    --definition                                 Path to JSON definition file
    --label                                      Optional Label (defaults to ID)
    --description                                Optional description
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--serviceId': String,
      '--definition': String,
      '--description': String,
      '--label': String
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--serviceId'] === undefined) {
    output.error('You must provide a service ID.')
    return 1
  }

  const stopSpinner = wait('Creating workflow')
  const addStamp = stamp()
  let result
  try {
    result = await createWorkflow({
      serviceId: argv['--serviceId'],
      label: argv['--label'],
      description: argv['--description'],
      definition: argv['--definition']
    })
  } catch (e) {
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${chalk.cyan('> Success!')} Workflow created with ID ${
      result.id
    }. ${addStamp()}\n`
  )

  return 0
}
