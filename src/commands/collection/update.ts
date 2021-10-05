import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { updateCollection } from 'src/lib/services/collection'

export default class CollectionCreate extends BaseCommand {
  static description = 'update a collection'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'collection ID',
      required: true
    }),
    label: flags.string({
      description: 'collection label'
    }),
    summary: flags.string({
      description: 'collection short summary'
    }),
    options: flags.string({
      description: 'collection options as JSON string'
    }),
    queries: flags.string({
      description: 'collection queries as JSON string'
    }),
    triggers: flags.string({
      description: 'collection triggers as JSON string'
    }),
    mapping: flags.string({
      description: 'collection mapping as JSON string'
    }),
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof CollectionCreate.flags>

    await updateCollection({
      id: flags.id,
      label: flags.label,
      summary: flags.summary,
      options: flags.options,
      queries: flags.queries,
      triggers: flags.triggers,
      mapping: flags.mapping,
    })

    ux.success(`collection ${flags.id} updated`)
  }
}
