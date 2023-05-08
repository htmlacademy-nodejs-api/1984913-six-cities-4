import chalk from 'chalk';
import { HELP_TITLE, HELP_COMMANDS, HELP_EXAMPLE } from '../../utils/constants.js';
import { CliCommandInterface } from '../../types/cli-command.interface.js';

const coloredTitle = chalk.bold(HELP_TITLE);
const coloredExample = chalk.bgGray(HELP_EXAMPLE);
const helpMessage = coloredTitle.concat('\n\n',coloredExample, '\n\n', HELP_COMMANDS);
export default class HelpCommand implements CliCommandInterface{
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(helpMessage);
  }
}
