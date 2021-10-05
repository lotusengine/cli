import { Command } from '@oclif/command'
import { Input, OutputArgs, OutputFlags } from '@oclif/parser'
import ux from 'cli-ux'
//import { APIClient } from 'src/lib/apiClient'

// https://github.com/oclif/oclif/issues/225#issuecomment-574484114
export default abstract class BaseCommand extends Command {
  //apiClient!: APIClient

  static flags = {
    // accountId: flags.string({ description: 'LotusEngine account ID' })
  }

  static args = []

  protected parsedArgs?: OutputArgs<any>
  protected parsedFlags?: OutputFlags<typeof BaseCommand.flags>

  // get api(): APIClient {
  //   if (this.apiClient) return this.apiClient
  //   this.apiClient = new APIClient(this.config)
  //   return this.apiClient
  // }

  async init(): Promise<void> {
    const { args, flags } = this.parse(
      this.constructor as Input<typeof BaseCommand.flags>
    )
    this.parsedArgs = args
    this.parsedFlags = flags
  }

  async catch(e: Error) {
    ux.error(e.message)
    //return handle(e);
  }

}
