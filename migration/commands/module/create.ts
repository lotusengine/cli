import chalk from 'chalk'
import { createModule } from './lib/api'
import getArgs from '../../lib/args'
import { readFile } from '../../lib/file'
import handleError from '../../lib/handle-error'
import { issue, wait, wrap, stamp, end } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Create a new module.')}

  ${chalk.dim('Usage:')}
  
    module create [options] 

  ${chalk.dim('Options:')}

    --label                                      Module label
    --summary                                    Module summary
    --source                                     Path to source file (ignored when repository provided)
    --repository                                 Module repository URL (overrides source)
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--label': String,
      '--summary': String,
      '--source': String,
      '--repository': String

    })
  } catch (e) {
    handleError(e)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--label'] === undefined) {
    output.error('You must provide a label.')
    return 1
  }

  if (argv['--source'] === undefined && argv['--repository'] === undefined) {
    output.error('You must provide code source or a URL.')
    return 1
  }

  if (argv['--source']) {
    argv['--source'] = await readFile(argv['--source'])
  }

  const stopSpinner = wait('Creating module')
  const addStamp = stamp()
  let result
  try {
    result = await createModule({
      label: argv['--label'],
      summary: argv['--summary'],
      repository: argv['--repository'],
      source: argv['--source']
    })
  } catch (e) {
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${chalk.cyan('Success!')} Module created with ID ${
      result.id
    }. ${addStamp()}`
  )
  output.print(end())

  return 0
}
