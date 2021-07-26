import chalk from 'chalk'
import { serveModule } from './lib/server'
import getArgs from '../../lib/args'
import handleError from '../../lib/handle-error'
import getPort from 'get-port'
import { buildCommandMenu } from '../../lib/menu'
import { run, param, issue, wait, wrap, stamp } from '../../lib/styles'

const commands = [{
  cmd: 'path',
  description: 'Path to local module file',
  required: true
}, {
  cmd: 'port',
  description: 'Port to serve on (default random)',
  required: false
}
]

export const help = () => {
  // @ts-expect-error ts-migrate(2345) FIXME: Type '{ cmd: string; description: string; required... Remove this comment to see the full error message
  buildCommandMenu('Serve module.', 'module serve [options]', commands)
}

export default async (ctx: any, opts: any, args: any, output: any) => {
  let argv

  try {
    argv = getArgs(args, {
      '--port': String,
      '--path': String
    })
  } catch (error) {
    handleError(error)
    return 1
  }

  if (argv['--help']) {
    return help()
  }

  if (argv['--path'] === undefined) {
    output.error('You must provide a module path.')
    return 1
  }

  const port = await getPort({ port: parseInt(argv['--port'] || 0) })

  const spinner = run(`Module "${argv['--path']}" listening to POST requests on http://127.0.0.1:${port}`)

  // Overwrite console else spineer makes a mess
  // @ts-expect-error ts-migrate(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' ty... Remove this comment to see the full error message
  console.log = console.error = console.info = console.warn = (...args) => {
    spinner.clear()
    spinner.frame()
    for (const arg of args) { process.stderr.write(`${arg}\n`) }
  }

  try {
    await serveModule(argv['--path'], port)
  } catch (e) {
    handleError(e)
    return 1
  }

  return 0
}
