import chalk from 'chalk'
import { invokeModule } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { buildCommandMenu } from '../../lib/menu'
import {
  issue,
  wait,
  code,
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

const commands = [{
  cmd: 'id',
  description: 'Module ID',
  required: true
}, {
  cmd: 'parameters',
  description: 'Module JSON parameters',
  required: false
}, {
  cmd: 'payload',
  description: 'Test JSON payload',
  required: false
}
]

export const help = () => {
  // @ts-expect-error ts-migrate(2345) FIXME: Type '{ cmd: string; description: string; required... Remove this comment to see the full error message
  buildCommandMenu('Invoke module with test payload.', 'module invoke [options]', commands)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
      '--parameters': String,
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
    output.error('You must provide a module ID.')
    return 1
  }

  const stopSpinner = wait('Invoking module')
  const addStamp = stamp()

  let result
  try {
    result = await invokeModule({
      id: argv['--id'],
      parameters: argv['--parameters'],
      payload: argv['--payload']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  if (result) {
    output.log(`Module ${param(module.id)} invoked ${chalk.gray(addStamp())}`)
    output.print('\n')
    output.print(header('Response'))
    output.print(json(result.response, 2))
  } else output.log(`Module not found ${chalk.gray(addStamp())}`)
  output.print(end())

  return 0
}
