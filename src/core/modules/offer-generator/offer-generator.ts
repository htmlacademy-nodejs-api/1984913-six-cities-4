import dayjs from 'dayjs';
import { MockData } from '../../../types/mock-data.type';
import { OfferGeneratorInterface } from '../../../types/offer-generator.interface';
import { GoodType, OfferGuestsAmount, OfferPrice, OfferRating, OfferRoomsAmount, OfferType } from '../../../utils/constants.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const statusValues = ['true', 'false'];

export default class OfferGenerator implements OfferGeneratorInterface{
  constructor(private readonly mockData:MockData){}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const name = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarUrl = getRandomItem<string>(this.mockData.avatars);
    const [city, latitude, longitude] = getRandomItem<string>(this.mockData.cities).split(' ');
    const type = getRandomItem<string>(Object.values(OfferType));
    const isPremium = getRandomItem<string>(statusValues);
    const isFavorite = getRandomItem<string>(statusValues);
    const isPro = getRandomItem<string>(statusValues);
    const images = getRandomItems<string>(this.mockData.images);
    const goods = getRandomItems<string>(Object.values(GoodType));
    const rating = generateRandomValue(OfferRating.Min,OfferRating.Max,OfferRating.Decimals);
    const rooms = generateRandomValue(OfferRoomsAmount.Min,OfferRoomsAmount.Max);
    const guests = generateRandomValue(OfferGuestsAmount.Min,OfferGuestsAmount.Max);
    const price = generateRandomValue(OfferPrice.Min,OfferPrice.Max);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    return [
      title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, goods, name, email,avatarUrl, isPro, latitude,longitude
    ].join('\t');

  }

}
