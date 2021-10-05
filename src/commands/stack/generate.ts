import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'
import { generateStack } from 'src/lib/services/stack'

export default class StackGenerate extends BaseCommand {
  static description = 'generate stack output'

  static flags = {
    ...BaseCommand.flags,
    app: flags.string({
      description: 'path to stack directory',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof StackGenerate.flags>

    const { app } = flags
    await generateStack({ projectPath: app })
  }
}