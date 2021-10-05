import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { listWorkflows } from 'src/lib/services/workflow'
import plural from 'pluralize'

export default class WorkflowList extends BaseCommand {
  static description = 'list available workflows'

  static aliases = ['workflow:ls']

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {

    ux.action.start(`Fetching workflows`)

    const workflows = await listWorkflows()

    ux.info(`${plural('workflow', workflows.length, true)} found`)

    if (workflows.length) {
      ux.table(workflows, {
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
