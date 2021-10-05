import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { triggerWorkflow } from 'src/lib/services/workflow'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'
import { ActionResponseStatus } from 'src/types/action'

export default class WorkflowTrigger extends BaseCommand {
  static description = 'trigger a workflow'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    }),
    payload: flags.string({
      description: 'workflow payload as JSON string'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowTrigger.flags>

    const { status, result } = await triggerWorkflow(flags)

    ux.specs({ status, result })

    if (status === ActionResponseStatus.SUCCESS)
      ux.success(`workflow ${flags.id} triggered successfully`)
    else
      ux.error(`workflow ${flags.id} triggered with error`)
  }
}
