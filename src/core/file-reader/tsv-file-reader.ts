import { readFileSync } from 'node:fs';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from '../../types/file-reader.interface.js';
import { CityType, OfferType } from '../../utils/constants.js';
import { GoodType } from '../../utils/constants.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, goods, name, email, avatarUrl, isPro, latitude, longitude]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: city as CityType,
        previewImage,
        images: images.split(';').map((image) => (image)),
        isPremium: JSON.parse(isPremium),
        isFavorite: JSON.parse(isFavorite),
        rating: Number.parseFloat(rating),
        type: type as OfferType,
        rooms: Number.parseInt(rooms, 10),
        guests: Number.parseInt(guests, 10),
        price: Number.parseInt(price, 10),
        goods: goods.split(';').map((good) => (good as GoodType)),
        user: {
          name,
          email,
          avatarUrl,
          isPro: JSON.parse(isPro)
        },
        location: {
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude)
        }
      }));
  }
}
