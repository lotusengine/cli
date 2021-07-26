import { Command, flags } from '@oclif/command'
import BaseCommand from '../../base'

export default class StackDeploy extends BaseCommand {
  static description = 'deploy a stack'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  //static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(StackDeploy)

    const name = flags.name ?? 'world'
    this.log(
      `hello ${name} from /Users/Yashua/Code/LotusEngine/CLI/src/commands/stack/deploy.ts`
    )
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
