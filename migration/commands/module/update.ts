import chalk from 'chalk'
import { updateModule } from './lib/api'
import getArgs from '../../lib/args'
import { readFile } from '../../lib/file'
import handleError from '../../lib/handle-error'
import { issue, wait, end, wrap, stamp } from '../../lib/styles'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('Update a module.')}

  ${chalk.dim('Usage:')}
  
    module update [options] 

  ${chalk.dim('Options:')}

    --id=ID                                      Module ID
    --label=LABEL                                Module label
    --summary=SUMMARY                            Module summary
    --source=PATH_TO_SOURCE                      Path to source file (ignored when repository provided)
    --repository=REPOSITORY                      Module repository URL (overrides source)

`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
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

  if (argv['--id'] === undefined) {
    output.error('You must provide a module ID.')
    return 1
  }

  if (argv['--source']) {
    argv['--source'] = await readFile(argv['--source'])
  }

  const stopSpinner = wait('Updating module')
  const addStamp = stamp()

  try {
    await updateModule({
      id: argv['--id'],
      label: argv['--label'],
      summary: argv['--summary'],
      repository: argv['--repository'],
      source: argv['--source']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(
    `${chalk.cyan('> Success!')} Module ${
      argv['--id']
    } updated. ${addStamp()}`
  )
  output.print(end())
  return 0
}
