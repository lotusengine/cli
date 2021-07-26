import chalk from 'chalk'
import { fetchLogs } from './lib/api'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import {
  issue,
  param,
  header,
  label,
  wait,
  json,
  line,
  wrap,
  stamp
} from '../../lib/styles'
// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/pluralize` if it exists or... Remove this comment to see the full error message
import plural from 'pluralize'
import strlen from '../../lib/strlen'

export const help = () => {
  console.log(`
  ${chalk.dim('Description:')}

    ${wrap('List workflow logs.')}

  ${chalk.dim('Usage:')}
  
    workflow logs [options] 

  ${chalk.dim('Options:')}

    --id                                         Workflow ID
    --processId                                  Process ID
    --query                                      Search query
    --scope                                      Search scope
    --from                                       Start date
    --until                                      End date
    --status                                     Process status [SUCCES|WARN|FAIL]
`)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--id': String,
      '--processId': String,
      '--query': String,
      '--scope': String,
      '--from': String,
      '--until': String,
      '--status': String
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--id'] === undefined) {
    output.error('You must provide a workflow ID.')
    return 1
  }

  const stopSpinner = wait('Fetching logs')
  const addStamp = stamp()
  let logs
  try {
    logs = await fetchLogs({
      workflowId: argv['--id'],
      processId: argv['--processId'],
      query: argv['--query'],
      scope: argv['--scope'],
      startDate: argv['--from'],
      endDate: argv['--until'],
      status: argv['--status']
    })
  } catch (e) {
    stopSpinner()
    handleError(e)
    return 1
  }
  stopSpinner()
  output.log(`${plural('log entry', logs.length, true)} found ${addStamp()}\n`)
  if (logs) {
    for (let index = logs.length - 1; index >= 0; index--) {
      const log = logs[index]

      output.print(header('Details'))
      output.print(label('Process ID', log.processId))
      output.print(label('Workflow ID', log.workflowId))
      output.print(label('Timestamp', log.triggeredAt))
      output.print(label('Status', log.status.toLowerCase()))
      output.print(header('Workflow entries'))
      output.print(json(log.entries, 4))

      if (index > 0) output.print(line(80))
    }
  } else output.log(`No logs found ${chalk.gray(addStamp())}`)
  output.print('\n')
  return 0
}
