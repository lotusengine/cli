import chalk from 'chalk'
import { deleteModule } from './lib/api'
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
  bool,
  end
} from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Delete a module.')}

  ${chalk.dim('Usage:')}
  
    module rm [options] 

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
  } catch (e) {
    handleError(e)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--id'] === undefined) {
    output.error('You must provide a module ID.')
    return 1
  }

  const stopSpinner = wait('Removing module')
  const addStamp = stamp()

  try {
    await deleteModule(argv['--id'])
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()

  output.log(
    `Module ${param(argv['--id'])} removed ${chalk.gray(addStamp())}`
  )
  output.print(end())

  return 0
}
