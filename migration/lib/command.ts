import { readDir } from './file'
import { resolve } from 'path'

export const getSubcommand = (cliArgs: any, commands: any) => {
  const [subcommand, ...rest] = cliArgs
  if (commands[subcommand]) {
    return { args: rest, handler: commands[subcommand] }
  }
}

export const getCommands = async () => {
  const paths = await readDir(resolve(__dirname, '../commands'))
  return new Set(
    paths.filter(name => name[0] !== '.').map(name => name.replace(/\..*/, ''))
  );
}
