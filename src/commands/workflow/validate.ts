import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'

export default class WorkflowValidate extends BaseCommand {
  static description = 'validate a workflow definition'

  static flags = {
    ...BaseCommand.flags,
    definition: flags.string({
      description: 'JSON schema definition (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowValidate.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
