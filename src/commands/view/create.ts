import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { createView } from 'src/lib/services/view'

export default class ViewCreate extends BaseCommand {
  static description = 'create a new view'

  static flags = {
    ...BaseCommand.flags,
    serviceId: flags.string({
      description: 'service ID',
      required: true
    }),
    label: flags.string({
      description: 'view label'
    }),
    summary: flags.string({
      description: 'view short summary'
    }),
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ViewCreate.flags>

    const result = await createView({
      serviceId: flags.serviceId,
      label: flags.label,
      summary: flags.summary,
    })

    ux.success(`view ${result.id} created`)
  }
}
