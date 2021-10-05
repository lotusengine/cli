import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { listParameters } from 'src/lib/services/parameter'
import plural from 'pluralize'

export default class ParameterList extends BaseCommand {
  static description = 'list available parameters'

  static aliases = ['parameter:ls']

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {

    ux.action.start(`Fetching parameters`)

    const parameters = await listParameters()

    ux.info(`${plural('parameter', parameters.length, true)} found`)

    if (parameters.length) {
      ux.table(parameters, {
        id: {
          header: 'ID'
        },
        key: {
          header: 'Key'
        },
        createdAt: {
          header: 'Created At'
        }
      })
    }

    ux.action.stop()
  }
}
