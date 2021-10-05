import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { updateWorkflow } from 'src/lib/services/workflow'

export default class WorkflowCreate extends BaseCommand {
  static description = 'update a workflow'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    }),
    label: flags.string({
      description: 'workflow label'
    }),
    summary: flags.string({
      description: 'workflow short summary'
    }),
    definition: flags.string({
      description: 'workflow definition as JSON string'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowCreate.flags>

    await updateWorkflow({
      id: flags.id,
      label: flags.label,
      summary: flags.summary,
      definition: flags.definition
    })

    ux.success(`workflow ${flags.id} updated`)
  }
}
