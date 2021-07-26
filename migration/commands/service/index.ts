import chalk from 'chalk'
import createOutput from '../../lib/output'
import { getSubcommand } from '../../lib/command'

import view from './view'
import create from './create'
import update from './update'
import list from './list'
import rm from './rm'

const help = () => {
  console.log(`
  ${chalk.bold('service')} <command> [options] 

  ${chalk.dim('Commands:')}

    ls                                           Show all services in a list
    view                                         Displays a single service in detail
    create                                       Create a new service
    update                                       Update new service
    rm                                           Remove a service and all related items
   

  ${chalk.dim('Options:')}

    --help                                       Output usage information
    --debug                                      Debug mode [off]
    --account                                    Account ID
`)
}

const subCommands = {
  create,
  update,
  view,
  ls: list,
  rm
}

export default async (ctx: any) => {
  const { debug, argv } = ctx
  const output = createOutput({ debug })

  const sub = getSubcommand(argv.slice(3), subCommands)

  if (!sub) return help()

  const { handler, args } = sub

  return handler(ctx, argv, args, output)
};

export const description = 'Manage services'
