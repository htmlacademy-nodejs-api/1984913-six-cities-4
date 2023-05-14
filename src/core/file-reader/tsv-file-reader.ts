import { createReadStream } from 'node:fs';
import { FileReaderInterface } from '../../types/file-reader.interface.js';
import EventEmitter from 'node:events';
import { ChunkSize } from '../../utils/constants.js';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark:ChunkSize.Read,
      encoding:'utf-8'
    });
    const lineBreak = '\n';

    let remainingData = '';
    let nextRowPosition = -1;
    let rowsAmount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextRowPosition = remainingData.indexOf(lineBreak)) >= 0) {
        const completeRow = remainingData.slice(0, nextRowPosition + 1);
        remainingData = remainingData.slice(++nextRowPosition);
        rowsAmount++;

        this.emit('row', completeRow);
      }
    }

    this.emit('complete', rowsAmount);

  }


}
