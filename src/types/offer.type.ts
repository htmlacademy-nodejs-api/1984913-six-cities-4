import { CityType, GoodType, HomeType } from '../core/modules/offer/offer.constants.js';
import { User } from './user.type.js';

export type LocationType = {
  latitude: number
  longitude: number
  }

export type OfferType = {
  title: string
  description: string
  postDate: Date
  city: CityType
  previewImage: string
  images: string[]
  isPremium: boolean
  isFavorite: boolean
  rating: number
  type: HomeType
  rooms: number
  guests: number
  price: number
  goods: GoodType[]
  user:User
  location: LocationType
  }
