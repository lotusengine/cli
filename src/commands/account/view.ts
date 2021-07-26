import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class AccountView extends BaseCommand {
  static description = 'view account details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'account ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof AccountView.flags>
    // const flags = this.parsedFlags as OutputFlags<typeof AccountList.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
