import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { updateService } from 'src/lib/services/service'

export default class ServiceCreate extends BaseCommand {
  static description = 'update a service'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'service ID',
      required: true
    }),
    label: flags.string({
      description: 'service label'
    }),
    summary: flags.string({
      description: 'service short summary'
    }),
    description: flags.string({
      description: 'service description (markdown OK)'
    }),
    parameters: flags.string({
      description: 'service parameters (inline or file path)'
    }),
    settings: flags.string({
      description: 'parameters input settings (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ServiceCreate.flags>

    await updateService({
      id: flags.id,
      label: flags.label,
      summary: flags.summary,
      description: flags.description,
      parameters: flags.parameters,
      settings: flags.settings
    })

    ux.success(`service ${flags.id} updated`)
  }
}
