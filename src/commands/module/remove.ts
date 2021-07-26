import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class ModuleRemove extends BaseCommand {
  static description = 'delete a module'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'module ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ModuleRemove.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
