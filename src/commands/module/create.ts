import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import chalk from 'chalk'
import ux from 'cli-ux'
import BaseCommand from 'src/lib/base'
import { createModule } from 'src/lib/services/module'

export default class ModuleCreate extends BaseCommand {
  static description = 'create a new module'

  static flags = {
    ...BaseCommand.flags,
    label: flags.string({
      description: 'module label',
      required: true
    }),
    summary: flags.string({
      description: 'module summary'
    }),
    source: flags.string({
      description: 'path to source file (ignored when repository provided)',
      required: true,
      exclusive: ['repository']
    }),
    repository: flags.string({
      description: 'module repository URL (overrides source)',
      required: true,
      exclusive: ['source']
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof ModuleCreate.flags>

    try {
      const result = await createModule({
        label: flags.label,
        summary: flags.summary,
        source: flags.source,
        repository: flags.repository
      })
      ux.info(`${chalk.cyan('Success!')} module created with ID ${result.id}`)
    } catch (e) {
      console.log(e)
    }
  }
}
