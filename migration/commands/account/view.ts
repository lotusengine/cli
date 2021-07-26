import chalk from 'chalk'
import { findAccount } from './lib/api'
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

    ${wrap('View account detail.')}

  ${chalk.dim('Usage:')}
  
    account view [options] 

  ${chalk.dim('Options:')}

    --id                                         Account ID
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--id'] === undefined) {
    output.error('You must provide an ID.')
    return 1
  }

  const stopSpinner = wait('Fetching account')
  const addStamp = stamp()

  let result
  try {
    result = await findAccount(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  if (result) {
    output.log(`Account ${param(result.id)} found ${chalk.gray(addStamp())}`)
    output.print('\n')
    output.print(header('General'))
    output.print(label('ID', result.id))
    output.print(label('Label', result.label))
    output.print(label('Created at', date(result.createdAt)))
    output.print(label('Is active', bool(result.isActive)))
    output.print(header('User access'))
    for (const a of result.permissions) {
      output.print(label(a.userId, a.permission.toLowerCase()))
    }
  } else output.log(`Account not found ${chalk.gray(addStamp())}`)

  output.print('\n')

  return 0
}
