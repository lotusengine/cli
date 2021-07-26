import chalk from 'chalk'
import createOutput from '../../lib/output'
import { getSubcommand } from '../../lib/command'
import list from './list'
import view from './view'

const subCommands = {
  ls: list,
  view
}

export const help = () => {
  console.log(`
  ${chalk.dim('Usage:')}
  
    account <command> [options] 

  ${chalk.dim('Commands:')}

    view                                         View account detail
    ls                                           List accounts
   
  ${chalk.dim('Options:')}

    --help                                       Output usage information
    --debug                                      Debug mode [off]
    --account=ACCOUNT_ID                         Account ID
`)
}

export default async (ctx: any) => {
  const { debug, argv } = ctx
  const output = createOutput({ debug })

  const sub = getSubcommand(argv.slice(3), subCommands)

  if (!sub) return help()

  const { handler, args } = sub

  return handler(ctx, argv, args, output)
};

export const description = 'Client accounts'
