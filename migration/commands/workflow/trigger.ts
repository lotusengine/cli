import chalk from 'chalk'
import { triggerWorkflow } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, label, header, json, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Test a workflow.')}

  ${chalk.dim('Usage:')}
  
    workflow trigger [options] 

  ${chalk.dim('Options:')}

    --id                                         Workflow ID
    --payload                                    Path to JSON payload file
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
      '--payload': String
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

  const stopSpinner = wait('Testing workflow')
  const addStamp = stamp()

  let result
  try {
    result = await triggerWorkflow({
      id: argv['--id'],
      payload: argv['--payload']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  const { status, data, message, code } = result

  if (status === 'error') {
    output.log(`Workflow yielded an error. ${addStamp()}\n`)

    output.print(label('Status', 'error'))
    output.print(label('Error code', code))
    output.print(label('Error message', message))
  } else {
    output.log(`Workflow ran successfully. ${addStamp()}\n`)
    output.print(label('Status', 'success'))
  }

  if (data) {
    output.print(header('Result'))
    output.print(json(data, 4))
  }
  output.print('\n')

  return 0
}
