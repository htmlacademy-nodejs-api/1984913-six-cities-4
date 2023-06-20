import dayjs from 'dayjs';
import { MockData } from '../../../types/mock-data.type.js';
import { OfferGeneratorInterface } from '../../../types/core/offer-generator.interface.js';
import { GoodType, OfferGuestsAmount, OfferPrice, OfferRating, OfferRoomsAmount, HomeType } from '../offer/offer.constants.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { UserStatus } from '../user/user.constants.js';

const WeekDayRange = {
  FirstDay: 1,
  LastDay:7
} as const;

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
    const type = getRandomItem<string>(Object.values(HomeType));
    const isPremium = getRandomItem<string>(statusValues);
    const isFavorite = getRandomItem<string>(statusValues);
    const userStatus = getRandomItem<string>(Object.values(UserStatus));
    const images = getRandomItems<string>(this.mockData.images);
    const goods = getRandomItems<string>(Object.values(GoodType)).join(';');
    const rating = OfferRating.Default;
    const rooms = generateRandomValue(OfferRoomsAmount.Min,OfferRoomsAmount.Max);
    const guests = generateRandomValue(OfferGuestsAmount.Min,OfferGuestsAmount.Max);
    const price = generateRandomValue(OfferPrice.Min,OfferPrice.Max);
    const postDate = dayjs().subtract(generateRandomValue(WeekDayRange.FirstDay, WeekDayRange.LastDay), 'day').toISOString();
    return [
      title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, goods, name, email,avatarUrl, userStatus, latitude,longitude
    ].join('\t');

  }

}
