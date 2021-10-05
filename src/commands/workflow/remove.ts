import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { deleteWorkflow } from 'src/lib/services/workflow'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class WorkflowRemove extends BaseCommand {
  static description = 'delete a workflow'

  static aliases = ['workflow:rm']

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowRemove.flags>

    await deleteWorkflow(flags.id)

    ux.success(`workflow ${flags.id} deleted`)
  }
}
