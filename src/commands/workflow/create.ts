import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { createWorkflow } from 'src/lib/services/workflow'

export default class WorkflowCreate extends BaseCommand {
  static description = 'create a new workflow'

  static flags = {
    ...BaseCommand.flags,
    serviceId: flags.string({
      description: 'service ID',
      required: true
    }),
    label: flags.string({
      description: 'workflow label'
    }),
    summary: flags.string({
      description: 'workflow short summary'
    }),
    definition: flags.string({
      description: 'workflow description as JSON string'
    }),
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowCreate.flags>

    const result = await createWorkflow({
      serviceId: flags.serviceId,
      label: flags.label,
      summary: flags.summary,
      definition: flags.definition
    })

    ux.success(`workflow ${result.id} created`)
  }
}
