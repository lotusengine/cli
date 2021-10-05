import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { listViews } from 'src/lib/services/view'
import plural from 'pluralize'

export default class ViewList extends BaseCommand {
  static description = 'list available views'

  static aliases = ['view:ls']

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {

    ux.action.start(`Fetching views`)

    const views = await listViews()

    ux.info(`${plural('view', views.length, true)} found`)

    if (views.length) {
      ux.table(views, {
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
