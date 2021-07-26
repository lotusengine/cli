import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class WorkflowTrigger extends BaseCommand {
  static description = 'trigger a workflow'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    }),
    payload: flags.string({
      description: 'JSON schema payload (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowTrigger.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
