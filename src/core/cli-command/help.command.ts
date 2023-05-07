import { HELP_MESSAGE } from '../../utils/constants.js';
import { CliCommandInterface } from './cli-command.interface';


export default class HelpCommand implements CliCommandInterface{
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(HELP_MESSAGE);
  }
}
