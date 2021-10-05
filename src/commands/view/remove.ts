import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { deleteView } from 'src/lib/services/view'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class ViewRemove extends BaseCommand {
  static description = 'delete a view'

  static aliases = ['view:rm']

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'view ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ViewRemove.flags>

    await deleteView(flags.id)

    ux.success(`view ${flags.id} deleted`)
  }
}
