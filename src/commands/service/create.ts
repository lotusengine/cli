import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { createService } from 'src/lib/services/service'

export default class ServiceCreate extends BaseCommand {
  static description = 'create a new service'

  static flags = {
    ...BaseCommand.flags,
    label: flags.string({
      description: 'service label'
    }),
    summary: flags.string({
      description: 'service short summary'
    }),
    description: flags.string({
      description: 'service description (markdown OK)'
    }),
    settings: flags.string({
      description: 'service settings as JSON string'
    }),
    definition: flags.string({
      description: 'settings input definition as JSON string'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ServiceCreate.flags>

    const result = await createService({
      label: flags.label,
      summary: flags.summary,
      description: flags.description,
      settings: flags.settings,
      definition: flags.definition
    })

    ux.success(`service ${result.id} created`)
  }
}
