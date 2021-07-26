import Help from '@oclif/plugin-help'
import chalk from 'chalk'
import logo from './lib/logo'

export default class MyHelpClass extends Help {
  showRootHelp(): void {
    console.log(`Logged in as ${chalk.cyan(logo)}`)
    super.showRootHelp()
  }
}
