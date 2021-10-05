import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { updateParameter } from 'src/lib/services/parameter'

export default class ParameterCreate extends BaseCommand {
  static description = 'update a parameter'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'parameter ID',
      required: true
    }),
    key: flags.string({
      description: 'parameter key'
    }),
    value: flags.string({
      description: 'parameter value'
    }),
    summary: flags.string({
      description: 'parameter short summary'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ParameterCreate.flags>

    await updateParameter({
      id: flags.id,
      key: flags.key,
      value: flags.value,
      summary: flags.summary
    })

    ux.success(`parameter ${flags.id} updated`)
  }
}
