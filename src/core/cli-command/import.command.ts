import chalk from 'chalk';
import { CliCommandInterface } from '../../types/cli-command.interface.js';
import { ErrorMessage, InfoMessage } from '../../utils/constants.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer, getErrorMessage } from '../helpers/index.js';

export default class ImportCommand implements CliCommandInterface{
  public readonly name = '--import';

  private onRow(row:string){
    const offer = createOffer(row);
    console.log(offer);
  }

  private onComplete(count:number){
    const message = InfoMessage.Import.concat(count.toString());
    console.log(chalk.bold.blue(message));
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('row', this.onRow);
    fileReader.on('complete', this.onComplete);

    try{
      await fileReader.read();
    }catch (error) {
      const message = getErrorMessage(error);
      const errorText = ErrorMessage.Import.concat(message);
      console.log(chalk.red(errorText));
    }

  }
}
