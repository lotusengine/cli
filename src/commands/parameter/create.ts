import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import ux from 'src/lib/ux'
import BaseCommand from 'src/lib/base'
import { createParameter } from 'src/lib/services/parameter'

export default class ParameterCreate extends BaseCommand {
  static description = 'create a new parameter'

  static flags = {
    ...BaseCommand.flags,
    key: flags.string({
      description: 'parameter key',
      required: true
    }),
    value: flags.string({
      description: 'parameter value',
      required: true
    }),
    summary: flags.string({
      description: 'parameter short summary'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ParameterCreate.flags>

    const result = await createParameter({
      key: flags.key,
      value: flags.value,
      summary: flags.summary
    })

    ux.success(`parameter ${result.id} created`)
  }
}
