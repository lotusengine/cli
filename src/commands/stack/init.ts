import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'
import { initStack } from 'src/lib/services/stack'

export default class StackInit extends BaseCommand {
  static description = 'init new stack'

  static flags = {
    ...BaseCommand.flags,
    language: flags.enum({
      options: ['typescript'],
      description: 'the language to be used for the new project',
      required: true,
      default: 'typescript'
    }),
    target: flags.string({
      description: 'path to install directory',
      required: true
    }),
    name: flags.string({
      description: 'project name',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof StackInit.flags>

    const { language, target, name } = flags
    await initStack({ language, targetDirectory: target, projectName: name })
  }
}
