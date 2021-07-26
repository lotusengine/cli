#!/usr/bin/env node
import 'dotenv/config'
import getArgs from './lib/args'
import { handleError } from './lib/error'
import createOutput from './lib/output'
import reportError from './lib/reporter'
import * as Sentry from '@sentry/node'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../package.json'. Consider usi... Remove this comment to see the full error message
import { version } from '../package.json'
import { getCommands } from './lib/command'

let debug = () => {}

const main = async (argv_: any) => {
  let argv = null

  try {
    argv = getArgs(
      argv_,
      {
        '--version': Boolean,
        '--help': Boolean,
        '--debug': Boolean
      },
      { permissive: true }
    )
  } catch (err) {
    handleError(err)
    return 1
  }
  const isDebugging = argv['--debug']
  const output = createOutput({ debug: isDebugging })

  const commands = await getCommands()

  // @ts-expect-error ts-migrate(2322) FIXME: Type '(str: any) => void' is not assignable to typ... Remove this comment to see the full error message
  debug = output.debug

  const subCommand = argv._[2] || 'help'

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
  debug(`Using LotusEngine CLI ${version}`)

  // the context object to supply to the providers or the commands
  const ctx = {
    argv: argv_
  }

  if (commands.has(subCommand)) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    debug(`user supplied known command "${subCommand}"`)
  } else {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    debug(`user supplied unknown command "${subCommand}"`)
    output.error(`The "${subCommand}" command does not exist`)
    return 1
  }

  if (subCommand === 'help') {
    ctx.argv.push('--help')
  }

  if (argv['--api'] && typeof argv['--api'] === 'string') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'apiUrl' does not exist on type '{ argv: ... Remove this comment to see the full error message
    ctx.apiUrl = argv['--api']
  }
  if (argv['--account'] && typeof argv['--account'] === 'string') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'accountId' does not exist on type '{ arg... Remove this comment to see the full error message
    ctx.accountId = argv['--account']
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'debug' does not exist on type '{ argv: a... Remove this comment to see the full error message
  ctx.debug = isDebugging

  let exitCode

  try {
    const command = require(`./commands/${subCommand}`).default

    exitCode = await command(ctx)
  } catch (err) {
    console.log(err)
    if (err.code) {
      output.debug(err.stack)
      output.error(err.message)

      return 1
    }

    // Otherwise it is an unexpected error and we should show the trace
    // and an unexpected error message
    output.error(`An unexpected error occurred in ${subCommand}: ${err.stack}`)
    return 1
  }

  return exitCode
}

// @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
debug('start')

const handleRejection = async (err: any) => {
  console.log(err)
  process.exit(1)
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
  debug('handling rejection')

  if (err) {
    if (err instanceof Error) {
      await handleUnexpected(err)
    } else {
      console.error(`An unexpected rejection occurred\n  ${err}`)
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      await reportError(Sentry, err)
    }
  } else {
    console.error('An unexpected empty rejection occurred')
  }

  process.exit(1)
}

const handleUnexpected = async (err: any) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  await reportError(Sentry, err)
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
  debug('handling unexpected error')

  console.error(`An unexpected error occurred!\n  ${err.stack} ${err.stack}`)

  process.exit(1)
}

process.on('unhandledRejection', handleRejection)
process.on('uncaughtException', handleUnexpected)

// Don't use `.then` here. We need to shutdown gracefully, otherwise
// subCommands waiting for further data won't work (like `logs` and `logout`)!
main(process.argv)
  .then(exitCode => {
    process.exitCode = exitCode
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '"nowExit"' is not assignable to ... Remove this comment to see the full error message
    process.emit('nowExit')
  })
  .catch(handleUnexpected)
