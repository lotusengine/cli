import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { findWorkflow } from 'src/lib/services/workflow'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class WorkflowFetch extends BaseCommand {
  static description = 'fetch workflow details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowFetch.flags>

    const res = await findWorkflow(flags.id)

    ux.specs(res)
  }
}
