import chalk from 'chalk'
import createOutput from '../../lib/output'
import { getSubcommand } from '../../lib/command'

import view from './view'
import create from './create'
import update from './update'
import list from './list'
import rm from './rm'
import invoke from './invoke'
import serve from './serve'

const help = () => {
  console.log(`
  ${chalk.bold('module')} <command> [options] 

  ${chalk.dim('Commands:')}

    ls                                           Show all modules in a list
    view                                         Displays a single module in detail
    create                                       Create a new module
    update                                       Update a module
    rm                                           Remove a module
    invoke                                       Invoke a module for testing
    serve                                        Wrap and launch module within a server
   
  ${chalk.dim('Options:')}

    --help                                       Output usage information
    --debug                                      Debug mode [off]
    --account=ACCOUNT_ID                         Account ID
`)
}

const subCommands = {
  create,
  update,
  view,
  ls: list,
  rm,
  invoke,
  serve
}

export default async (ctx: any) => {
  const { debug, argv } = ctx
  const output = createOutput({ debug })

  const sub = getSubcommand(argv.slice(3), subCommands)

  if (!sub) return help()

  const { handler, args } = sub

  return handler(ctx, argv, args, output)
}

export const description = 'Manage custom modules'
