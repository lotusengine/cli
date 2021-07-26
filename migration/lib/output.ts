import chalk from 'chalk'
import { format } from 'util'
import { Console } from 'console'

export default ({ debug: debugEnabled = false }) => {
  const print = (str: any) => {
    process.stderr.write(str)
  }

  const log = (str: any, color = chalk.grey) => {
    print(`${color('>')} ${str}\n`)
  }

  const dim = (str: any, color = chalk.grey) => {
    print(`${color(`> ${str}`)}\n`)
  }

  const warn = (str: any) => {
    log(chalk`{yellow.bold WARN!} ${str}`)
  }

  const note = (str: any) => {
    log(chalk`{yellow.bold NOTE:} ${str}`)
  }

  const error = (str: any) => {
    log(chalk`{red.bold Error!} ${str}`, chalk.red)
  }

  const ready = (str: any) => {
    print(`${chalk.cyan('> Ready!')} ${str}\n`)
  }

  const success = (str: any) => {
    print(`${chalk.cyan('> Success!')} ${str}\n`)
  }

  const debug = (str: any) => {
    if (debugEnabled) {
      log(
        `${chalk.bold('[debug]')} ${chalk.gray(
          `[${new Date().toISOString()}]`
        )} ${str}`
      )
    }
  }

  // This is pretty hacky, but since we control the version of Node.js
  // being used because of `pkg` it's safe to do in this case.
  const c = {
    _times: new Map(),
    // @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' ty... Remove this comment to see the full error message
    log: (a: any, ...args) => {
      debug(format(a, ...args))
    }
  }

  const time = async (label: any, fn: any) => {
    const promise = typeof fn === 'function' ? fn() : fn
    if (debugEnabled) {
      c.log(label)
      Console.prototype.time.call(c, label)
      const r = await promise
      Console.prototype.timeEnd.call(c, label)
      return r
    }

    return promise
  }

  return {
    print,
    log,
    warn,
    error,
    ready,
    success,
    debug,
    dim,
    time,
    note
  }
}
