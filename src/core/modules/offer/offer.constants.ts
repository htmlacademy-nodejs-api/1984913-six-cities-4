export const DEFAULT_OFFERS_AMOUNT = 60;
export const PREMIUM_OFFERS_AMOUNT = 3;
export const DEFAULT_COMMENTS_AMOUNT = 0;

export const OfferTitleLength = {
  Min: 10,
  Max: 100,
};

export const OfferDescriptionLength = {
  Min: 20,
  Max: 1024,
};

export const OfferRoomsAmount = {
  Min: 1,
  Max: 8,
};

export const OfferGuestsAmount = {
  Min: 1,
  Max: 10,
};

export const OfferRating = {
  Min: 1,
  Max: 5,
  Decimals:1,
};

export const OfferPrice = {
  Min: 100,
  Max: 100000,
};

export enum HomeType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}

export enum GoodType {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export enum CityType {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}
