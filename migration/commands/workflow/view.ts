import chalk from 'chalk'
import { findWorkflow } from './lib/api'
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
  json,
  bool
} from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('View workflow detail.')}

  ${chalk.dim('Usage:')}
  
    workflow view [options] 

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

  const stopSpinner = wait('Fetching workflow')
  const addStamp = stamp()

  let workflow
  try {
    workflow = await findWorkflow(argv['--id'])
  } catch (e) {
    stopSpinner()

    handleError(e)
    return 1
  }
  stopSpinner()

  if (workflow) {
    output.log(`Workflow ${param(workflow.id)} found ${chalk.gray(addStamp())}`)
    output.print('\n')
    output.print(header('General'))
    output.print(label('ID', workflow.id))
    output.print(label('Label', workflow.label))
    output.print(label('Description', workflow.description))
    output.print(label('Created at', date(workflow.createdAt)))
    output.print(label('Updated at', date(workflow.updatedAt)))
    output.print(
      label('URL path', `${process.env.LOTUS_ACCOUNT_ID}/${workflow.id}`)
    )
    output.print(header('Definition'))
    output.print(json(workflow.definition, 4))
  } else output.log(`Workflow not found ${chalk.gray(addStamp())}`)
  output.print('\n')

  return 0
}
