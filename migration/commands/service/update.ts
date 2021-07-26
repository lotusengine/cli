import chalk from 'chalk'
import { updateService } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Update a service.')}

  ${chalk.dim('Usage:')}
  
    service update [options] 

  ${chalk.dim('Options:')}

    -i, --id                                     Service ID
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

  if (argv['--id'] === undefined) {
    output.error('You must provide a service ID.')
    return 1
  }

  const stopSpinner = wait('Updating service')
  const addStamp = stamp()

  try {
    await updateService(argv['--id'], {
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
  output.log(
    `${chalk.cyan('> Success!')} Service ${
      argv['--id']
    } updated. ${addStamp()}\n`
  )

  return 0
}
