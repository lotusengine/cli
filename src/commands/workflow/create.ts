import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import BaseCommand from '../../base'
import { createWorkflow } from '../../lib/apis/workflow'
import ux from 'cli-ux'
import chalk from 'chalk'

export default class WorkflowCreate extends BaseCommand {
  static description = 'create a new workflow'

  static flags = {
    ...BaseCommand.flags,
    serviceId: flags.string({
      description: 'serviice ID',
      required: true
    }),
    label: flags.string({
      description: 'workflow label'
    }),
    summary: flags.string({
      description: 'workflow summary'
    }),
    definition: flags.string({
      description: 'JSON schema definition (inline or file path)'
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof WorkflowCreate.flags>

    try {
      const result = await createWorkflow({
        serviceId: flags.serviceId,
        label: flags.label,
        summary: flags.summary,
        definition: flags.definition
      })
      ux.info(`${chalk.cyan('Success!')} workflow created with ID ${result.id}`)
    } catch (e) {
      ux.error(e)
    }
  }
}
