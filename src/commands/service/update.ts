import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class ServiceUpdate extends BaseCommand {
  static description = 'update a service'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'service ID'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ServiceUpdate.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
