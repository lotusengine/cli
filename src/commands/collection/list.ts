import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { listCollections } from 'src/lib/services/collection'
import plural from 'pluralize'

export default class CollectionList extends BaseCommand {
  static description = 'list available collections'

  static aliases = ['collection:ls']

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {

    ux.action.start(`Fetching collections`)

    const collections = await listCollections()

    ux.info(`${plural('collection', collections.length, true)} found`)

    if (collections.length) {
      ux.table(collections, {
        id: {
          header: 'ID'
        },
        label: {
          header: 'Label'
        },
        createdAt: {
          header: 'Created At'
        }
      })
    }

    ux.action.stop()
  }
}
