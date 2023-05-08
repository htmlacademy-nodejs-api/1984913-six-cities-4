import { CliCommandInterface } from '../../types/cli-command.interface';
import { ErrorMessage } from '../../utils/constants.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';

export default class ImportCommand implements CliCommandInterface{
  public readonly name = '--import';

  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());

    try{
      fileReader.read();
      console.log(fileReader.toArray());
    }catch (error) {

      if (!(error instanceof Error)) {
        throw error;
      }
      const errorText = ErrorMessage.Import.concat(error.message);
      console.log(errorText);
    }

  }
}
