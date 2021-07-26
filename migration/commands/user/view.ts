import chalk from 'chalk'
import { findUser } from './lib/api'
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

    ${wrap('View user detail.')}

  ${chalk.dim('Usage:')}
  
    user view [options] 

  ${chalk.dim('Options:')}

    --id=ID                                      User ID
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

  const stopSpinner = wait('Fetching user')
  const addStamp = stamp()

  let result
  try {
    result = await findUser(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  if (result) {
    output.log(`User ${param(result.id)} found ${chalk.gray(addStamp())}`)
    output.print('\n')
    output.print(header('General'))
    output.print(label('ID', result.id))
    output.print(label('Email', result.emailAddress))
    output.print(label('Created at', date(result.createdAt)))
    output.print(label('Is active', bool(result.isActive)))
    // output.print(header('User access'))
    // for (const a of result.permissions) {
    //   output.print(label(a.userId, a.permission.toLowerCase()))
    // }
  } else output.log(`User not found ${chalk.gray(addStamp())}`)

  output.print('\n')

  return 0
}
