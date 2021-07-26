import chalk from 'chalk'
import { findService } from './lib/api'
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

    ${wrap('View service detail.')}

  ${chalk.dim('Usage:')}
  
    service view [options] 

  ${chalk.dim('Options:')}

    -i, --id                                     Service ID
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
    output.error('You must provide a service ID.')
    return 1
  }

  const stopSpinner = wait('Fetching service')
  const addStamp = stamp()

  let service
  try {
    service = await findService(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  if (service) {
    output.log(
      `Service ${param(service.id)} found ${chalk.gray(addStamp())}`
    )
    output.print('\n')
    output.print(header('General'))
    output.print(label('ID', service.id))
    output.print(label('label', service.label))
    output.print(label('description', service.description))
    output.print(label('Created at', date(service.createdAt)))
    output.print(label('Updated at', date(service.updatedAt)))
    output.print(header('Mapping'))
    output.print(json(service.mapping, 4))
  } else output.log(`Service not found ${chalk.gray(addStamp())}`)
  output.print('\n')

  return 0
}
