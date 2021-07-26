// @ts-expect-error ts-migrate(2614) FIXME: Module '"../../node_modules/chalk/types"' has no e... Remove this comment to see the full error message
import chalk, { red } from 'chalk'
import {
  issue,
  wait,
  code,
  wrap,
  stamp,
  label,
  header,
  param,
  date,
  json,
  bool,
  end
} from './styles'

// Build a subcommand menu/usage
export const buildCommandMenu = (description: any, usage: any, args = []) => {
  const menu = []
  for (const { cmd, description, required } of args) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'never'.
    menu.push(`--${cmd}${ ' '.repeat(50 - cmd.length)}${description}${required ? red(' required') : ''}`)
  }

  console.log(`
  ${chalk.dim('Description:')}

    ${wrap(description)}

  ${chalk.dim('Usage:')}
  
    ${usage}

  ${chalk.dim('Options:')}

    ${menu.join('\n    ')}
`)
}
