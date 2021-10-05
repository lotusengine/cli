import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from 'src/lib/base'
import { requestToken } from 'src/lib/auth'

export default class AuthLogin extends BaseCommand {
  static description = 'login with your LotusEngine credentials'

  static aliases = ['login']

  static flags = {
    ...BaseCommand.flags,
    browser: flags.string({
      char: 'b',
      description: 'browser to open (example: "safari")'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof AuthLogin.flags>

    await requestToken({ browser: flags.browser })

    await this.config.runHook('recache', { type: 'login' })
  }
}
