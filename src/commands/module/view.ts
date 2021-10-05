import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'

export default class ModuleView extends BaseCommand {
  static description = 'view module details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'module ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ModuleView.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
