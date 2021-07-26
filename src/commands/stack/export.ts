import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class StackExport extends BaseCommand {
  static description = 'export a stack'

  static examples = [
    `$ lotusengine hello
hello world from ./src/hello.ts!
`
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  // static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(StackExport)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
