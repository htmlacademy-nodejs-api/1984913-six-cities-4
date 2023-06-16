import {Expose} from 'class-transformer';

export default class UploadImagesRdo {
  @Expose()
  public images!: string[];
}
