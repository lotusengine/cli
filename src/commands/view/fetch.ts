import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { findView } from 'src/lib/services/view'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class ViewFetch extends BaseCommand {
  static description = 'fetch view details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'view ID'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ViewFetch.flags>

    const res = await findView(flags.id)

    ux.specs(res)
  }
}
