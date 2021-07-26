import chalk from 'chalk'
import { getModule } from './lib/api'
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
  bool,
  end
} from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('View module detail.')}

  ${chalk.dim('Usage:')}
  
    module view [options] 

  ${chalk.dim('Options:')}

    --id                                         Module ID
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
    output.error('You must provide a module ID.')
    return 1
  }

  const stopSpinner = wait('Fetching module')
  const addStamp = stamp()

  let result
  try {
    result = await getModule(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  if (result) {
    output.log(`Module ${param(result.id)} found ${chalk.gray(addStamp())}`)
    output.print('\n')
    output.print(header('General'))
    output.print(label('ID', result.id))
    output.print(label('Label', result.label))
    output.print(label('Summmary', result.summary))
    output.print(label('Repository', result.repository))
    output.print(label('Created at', date(result.createdAt)))
    output.print(label('Updated at', date(result.updatedAt)))
    if (result.source) {
      output.print(header('Source code preview'))
      output.print(result.source.slice(0, 500))
      if (result.source.length > 500) { output.print('\n\n---------- CODE TRUNCATED ----------') }
      output.print('\n')
    }
  } else output.log(`Module not found ${chalk.gray(addStamp())}`)
  output.print(end())

  return 0
}
