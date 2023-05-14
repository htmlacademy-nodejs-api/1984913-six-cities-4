import got from 'got';
import { MockData } from '../../types/mock-data.type.js';
import { ErrorMessage, InfoMessage } from '../../utils/constants.js';
import OfferGenerator from '../modules/offer-generator/offer-generator.js';
import { CliCommandInterface } from '../../types/cli-command.interface.js';
import TSVFileWriter from '../file-reader/tsv-file-writer.js';
import chalk from 'chalk';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = +count;

    try {
      this.initialData = await got.get(url).json();
    } catch {
      const message = ErrorMessage.Fetch.concat(url);
      console.log(chalk.red(message));
      return;
    }

    const offerGenerator = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGenerator.generate());
    }

    const message = InfoMessage.Generate.concat(filepath);
    console.log(chalk.bold.blue(message));
  }
}
