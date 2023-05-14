import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriterInterface } from '../../types/file-writer.interface.js';
import { ChunkSize } from '../../utils/constants.js';

export default class TSVFileWriter implements FileWriterInterface{
  private writeStream:WriteStream;
  constructor(public readonly filename:string){
    this.writeStream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: ChunkSize.Write,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.writeStream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.writeStream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}
