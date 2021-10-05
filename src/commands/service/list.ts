import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { listServices } from 'src/lib/services/service'
import plural from 'pluralize'

export default class ServiceList extends BaseCommand {
  static description = 'list available services'

  static aliases = ['service:ls']

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {

    ux.action.start(`Fetching services`)

    const services = await listServices()

    ux.info(`${plural('service', services.length, true)} found`)

    if (services.length) {
      ux.table(services, {
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
