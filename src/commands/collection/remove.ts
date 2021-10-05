import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { deleteCollection } from 'src/lib/services/collection'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class CollectionRemove extends BaseCommand {
  static description = 'delete a collection'

  static aliases = ['collection:rm']

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'collection ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof CollectionRemove.flags>

    await deleteCollection(flags.id)

    ux.success(`collection ${flags.id} deleted`)
  }
}
