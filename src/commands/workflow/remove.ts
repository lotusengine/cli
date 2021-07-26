import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class WorkflowRemove extends BaseCommand {
  static description = 'remove a workflow'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowRemove.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
