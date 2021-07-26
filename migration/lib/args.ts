import arg from 'arg'

const ARG_COMMON = {
  '--help': Boolean,
  '-h': '--help',

  '--debug': Boolean,
  '-d': '--debug',

  '--token': String,
  '-t': '--token',

  '--local-config': String,
  '-A': '--local-config',

  '--global-config': String,
  '-Q': '--global-config',

  '--api': String
}

export default (argv: any, argsOptions: any, argOptions = {}) => arg(Object.assign({}, ARG_COMMON, argsOptions), {
  ...argOptions,
  argv
})
