import { flags } from '@oclif/command'
import BaseCommand from 'src/lib/base'

export default class ModuleList extends BaseCommand {
  static description = 'list available modules'

  static aliases = ['module:ls']

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID'
    })
  }

  async run(): Promise<void> {
    // const flags = this.parsedFlags as OutputFlags<typeof AccountList.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
