import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class WorkflowLog extends BaseCommand {
  static description = 'view workflow logs'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'workflow ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowLog.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
