import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'cli-ux'
import BaseCommand from '../../base'
import { listWorkflows } from '../../lib/apis/workflow'
import plural from 'pluralize'

export default class WorkflowList extends BaseCommand {
  static description = 'list available workflows'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID'
    })
  }

  async run(): Promise<void> {
    try {
      ux.action.start('Fetching workflows')
      const workflows = await listWorkflows()
      ux.info(`${plural('workflow', workflows.length, true)} found`)
      if (workflows.length > 0) {
        ux.table(workflows, {
          id: {
            header: 'ID'
          },
          label: {
            header: 'Label'
          },
          createAt: {
            header: 'Created At'
          }
        })
      }

      ux.action.stop()
    } catch (e) {
      console.log(e)
    }
  }
}
