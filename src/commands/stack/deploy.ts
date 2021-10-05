import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'
import { deployStack } from 'src/lib/services/stack'
import ux from 'src/lib/ux'

export default class StackDeploy extends BaseCommand {
  static description = 'deploy a stack'

  static flags = {
    ...BaseCommand.flags,
    app: flags.string({
      description: 'path to stack app folder',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof StackDeploy.flags>

    const res = await deployStack({
      app: flags.app
    })

    ux.success(`stack ${res.id} deployed`)
  }
}
