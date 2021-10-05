import BaseCommand from 'src/lib/base'

export default class UserList extends BaseCommand {
  static description = 'list users'

  async run(): Promise<void> {
    // const flags = this.parsedFlags as OutputFlags<typeof AccountList.flags>

    try {
      console.log('not done')
    } catch (e) {
      console.log(e)
    }
  }
}
