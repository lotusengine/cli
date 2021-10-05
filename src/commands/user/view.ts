import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { ux } from 'cli-ux'
import BaseCommand from 'src/lib/base'
import { findUser } from 'src/lib/services/user'
import { bool, date, header, label, param } from 'src/lib/styles'

export default class UserView extends BaseCommand {
  static description = 'view user details'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'user ID',
      required: true
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof UserView.flags>

    ux.action.start('Fetching user')

    try {
      const result = await findUser(flags.id)
      if (result) {
        ux.info(`User ${param(result.id)} found`)
        ux.info(header('General'))
        ux.info(label('ID', result.id))
        ux.info(label('Email', result.emailAddress))
        ux.info(label('Created at', date(result.createdAt)))
        ux.info(label('Is active', bool(result.isActive)))
        // output.print(header('User access'))
        // for (const a of result.permissions) {
        //   output.print(label(a.userId, a.permission.toLowerCase()))
        // }
      } else ux.warn(`User not found`)
    } catch (e) {
      console.log(e)
    }
    ux.action.stop()
  }
}
