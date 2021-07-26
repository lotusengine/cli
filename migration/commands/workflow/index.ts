import chalk from 'chalk'
import createOutput from '../../lib/output'
import { getSubcommand } from '../../lib/command'

import view from './view'
import create from './create'
import update from './update'
import list from './list'
import rm from './rm'
import log from './log'
import validate from './validate'
import trigger from './trigger'

const help = () => {
  console.log(`
  ${chalk.bold('workflow')} <command> [options] 

  ${chalk.dim('Commands:')}

    ls                                           Show all workflows in a list
    view                                         Displays a single workflow in detail
    create                                       Create a new workflow
    update                                       Update new workflow
    rm                                           Remove a workflow
    validate                                     Validate workflow schema
    logs                                         View logs
    trigger                                      Invoke workflow
   

  ${chalk.dim('Options:')}

    -h, --help                                   Output usage information
    -d, --debug                                  Debug mode [off]
    -a, --account                                Account ID
`)
}

const subCommands = {
  create,
  update,
  view,
  ls: list,
  rm,
  validate,
  logs: log,
  trigger
}

export default async (ctx: any) => {
  const { debug, argv } = ctx
  const output = createOutput({ debug })

  const sub = getSubcommand(argv.slice(3), subCommands)

  if (!sub) return help()

  const { handler, args } = sub

  return handler(ctx, argv, args, output)
};

export const description = 'Manage workflows'
