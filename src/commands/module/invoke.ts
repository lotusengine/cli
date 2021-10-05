import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'

export default class ModuleInvoke extends BaseCommand {
  static description = 'invoke module with test payload'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'module ID',
      required: true
    }),
    parameters: flags.string({
      description: 'module JSON parameters'
    }),
    payload: flags.string({
      description: 'test JSON payload'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ModuleInvoke.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
