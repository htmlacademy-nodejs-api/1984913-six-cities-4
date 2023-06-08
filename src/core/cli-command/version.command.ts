import { readFileSync } from 'node:fs';
import { CliCommandInterface } from '../../types/core/cli-command.interface.js';
import path from 'node:path';
import { CommandName } from '../../utils/constants.js';

export default class VersionCommand implements CliCommandInterface{
  public readonly name = CommandName.Version;

  private readVersion():string {
    const contentPageJSON = readFileSync(path.resolve('./package.json'), 'utf-8');
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(version);
  }
}
