// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/mri` if it exists or add a... Remove this comment to see the full error message
import mri from 'mri'
import chalk from 'chalk'
import logo from '../lib/logo'
import { handleError } from '../lib/error'

import { getCommands } from '../lib/command'
import { version } from '../../package.json'

const help = async () => {
  const cmds = await getCommands()

  const commands = {}

  cmds.forEach((c) => {
    const { description } = require(`./${c}`)
    commands[c] = description
  })
  console.log(`
  ${chalk.magentaBright(`${logo}`)}

  ${chalk.dim('Version:')}  ${version}

  ${chalk.dim('Commands:')}

    ${Object.keys(commands)
      .map((c) => {
        return `${c}${' '.repeat(45 - c.length)}${commands[c]}`
      })
      .join('\n    ')}

  ${chalk.dim('Options:')}

    --help                                       Output usage information
    --debug                                      Debug mode [off]
    --account=ACCOUNT_ID                         Account ID (or use LOTUS_ACCOUNT_ID env var)

  ${chalk.dim('Support:')}  

    API docs                                     https://lotusengine.com/docs
`)
}

// Options
let argv

const main = async (ctx: any) => {
  argv = mri(ctx.argv.slice(2), {
    boolean: ['help', 'debug', 'account'],
    alias: {}
  })

  argv._ = argv._.slice(1)

  if (argv.help || argv._[0] === 'help') {
    await help()
    process.exit(0)
  }
}

export default async (ctx: any) => {
  try {
    await main(ctx)
  } catch (err) {
    handleError(err)
    process.exit(1)
  }
}

export const description = 'General help'
