import { OfferType } from '../../types/offer.type.js';
import { CityType, GoodType, HomeType } from '../modules/offer/offer.constants.js';
import { UserStatus } from '../modules/user/user.constants.js';

export const createOffer = (offerData:string):OfferType=>{

  const [title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, goods, name, email, avatarUrl, userStatus, latitude, longitude] = offerData.replace('\n','').split('\t');

  const user = {
    name,
    email,
    avatarUrl,
    userStatus: userStatus as UserStatus
  };

  const location = {
    latitude: +latitude,
    longitude: +longitude
  };

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as CityType,
    previewImage,
    images: images.split(';').map((image) => (image)),
    isPremium: JSON.parse(isPremium),
    isFavorite: JSON.parse(isFavorite),
    rating: +rating,
    type: type as HomeType,
    rooms: +rooms,
    guests: +guests,
    price: +price,
    goods: goods.split(';').map((good) => (good as GoodType)),
    user,
    location
  };

};
