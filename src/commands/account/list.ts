import BaseCommand from 'base'

export default class AccountList extends BaseCommand {
  static description = 'list user accounts'

  static flags = {
    ...BaseCommand.flags
  }

  async run(): Promise<void> {
    // const flags = this.parsedFlags as OutputFlags<typeof AccountList.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
