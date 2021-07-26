import chalk from 'chalk'
import { createService } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Create a new service.')}

  ${chalk.dim('Usage:')}
  
    service create [options] 

  ${chalk.dim('Options:')}

    --label                                      Optional label (defaults to ID)
    --domain                                     Custom domain    
    --description                                Optional description
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--label': String,
      '--description': String,
      '--domain': String
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  const stopSpinner = wait('Creating service')
  const addStamp = stamp()
  let service
  try {
    service = await createService({
      label: argv['--label'],
      description: argv['--description'],
      domain: argv['--domain']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${chalk.cyan('> Success!')} Service created with ID ${
      service.id
    }. ${addStamp()}\n`
  )

  return 0
}
