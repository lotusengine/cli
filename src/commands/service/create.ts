import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import chalk from 'chalk'
import { ux } from 'cli-ux'
import BaseCommand from '../../base'
import { createService } from '../../lib/apis/service'

export default class ServiceCreate extends BaseCommand {
  static description = 'create a new service'

  static flags = {
    ...BaseCommand.flags,
    label: flags.string({
      description: 'service label'
    }),
    description: flags.string({
      description: 'service description'
    }),
    definition: flags.string({
      description: 'JSON schema definition (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ServiceCreate.flags>

    try {
      const result = await createService({
        label: flags.label,
        description: flags.description,
        definition: flags.definition
      })
      ux.info(`${chalk.cyan('Success!')} service created with ID ${result.id}`)
    } catch (e) {
      console.log(e)
    }
  }
}
