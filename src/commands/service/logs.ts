import { flags } from '@oclif/command'
import { OutputFlags } from '@oclif/parser'
import { fetchLogs } from 'src/lib/services/service'
import BaseCommand from 'src/lib/base'
import ux from 'src/lib/ux'

export default class CollectionLog extends BaseCommand {
  static description = 'view service logs'

  static flags = {
    ...BaseCommand.flags,
    id: flags.string({
      description: 'service ID',
      required: true
    }),
    from: flags.string({
      description: 'start date (ex: 2014-12-23, 2014-12-13T12:34:23,  2014-12-13T12:34:23:000Z'
    }),
    until: flags.string({
      description: 'start date (ex: 2014-12-23, 2014-12-13T12:34:23,  2014-12-13T12:34:23:000Z'
    }),
    processId: flags.string({
      description: 'filter by process ID'
    }),
    workflowId: flags.string({
      description: 'filter by workflow ID'
    }),
    status: flags.enum({
      options: ['success', 'error'],
      description: 'filter by status',
    }),
    term: flags.string({
      description: 'search query term',
    }),
    scope: flags.string({
      description: 'search query scope',
    })
  }

  async run(): Promise<void> {
    const flags = this.parsedFlags as OutputFlags<typeof CollectionLog.flags>

    const logs = await fetchLogs(flags)

    for (const log of logs)
      ux.specs(log)

  }
}
