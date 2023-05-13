import { Offer } from '../../types/offer.type.js';
import { CityType, GoodType, OfferType } from '../../utils/constants.js';

export const createOffer = (offerData:string):Offer=>{

  const [title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating, type, rooms, guests, price, goods, name, email, avatarUrl, isPro, latitude, longitude] = offerData.replace('\n','').split('\t');

  const user = {
    name,
    email,
    avatarUrl,
    isPro: JSON.parse(isPro)
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
    type: type as OfferType,
    rooms: +rooms,
    guests: +guests,
    price: +price,
    goods: goods.split(';').map((good) => (good as GoodType)),
    user,
    location
  };

};
