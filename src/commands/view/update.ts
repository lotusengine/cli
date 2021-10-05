import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { updateView } from 'src/lib/services/view'

export default class ViewCreate extends BaseCommand {
  static description = 'update a view'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'view ID',
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

    await updateView({
      id: flags.id,
      label: flags.label,
      summary: flags.summary,
    })

    ux.success(`view ${flags.id} updated`)
  }
}
