import { CityType, GoodType, OfferType } from '../utils/constants.js';
import { User } from './user.type.js';

export type LocationType = {
  latitude: number
  longitude: number
  }

export type Offer = {
  title: string
  description: string
  postDate: Date
  city: CityType
  previewImage: string
  images: string[]
  isPremium: boolean
  isFavorite: boolean
  rating: number
  type: OfferType
  rooms: number
  guests: number
  price: number
  goods: GoodType[]
  user:User
  location: LocationType
  }
