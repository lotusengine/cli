import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class WorkflowVUpdate extends BaseCommand {
  static description = 'udpate a workflow'

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
      description: 'workflow summary'
    }),
    definition: flags.string({
      description: 'JSON schema definition (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowVUpdate.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
