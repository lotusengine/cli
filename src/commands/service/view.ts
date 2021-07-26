import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class ServiceView extends BaseCommand {
  static description = 'view service details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'service ID'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ServiceView.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
