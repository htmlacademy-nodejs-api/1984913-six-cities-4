import { CityLocation, UserType } from '../../const';
import CommentDto from '../../dto/comments/comment.dto.js';
import OfferDto from '../../dto/offer/offer.dto.js';
import UserWithTokenDto from '../../dto/user/user-with-token.dto.js';
import UserDto from '../../dto/user/user.dto.js';
import { Comment, Comments, Offer, Offers, User } from '../../types/types.js';

export const adaptLoginToClient = (user: UserWithTokenDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  type: user.userStatus === UserType.Pro ? UserType.Pro : UserType.Regular,
  token: user.token,
});

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  type: user.userStatus === UserType.Pro ? UserType.Pro : UserType.Regular,
});

export const adaptOffersToClient = (offers: OfferDto[]): Offers =>
  offers
    .filter((offer: OfferDto) => offer.user !== null)
    .map((offer: OfferDto) => adaptOfferToClient(offer));

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: { name: offer.city, location: CityLocation[offer.city] },
  location: CityLocation[offer.city],
  previewImage: offer.previewImage,
  type: offer.type,
  bedrooms: offer.rooms,
  description: offer.description,
  goods: offer.goods,
  host: adaptUserToClient(offer.user),
  images: offer.images,
  maxAdults: offer.guests,
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comments =>
  comments
    .filter((comment: CommentDto) => comment.user !== null)
    .map((comment: CommentDto) => adaptCommentToClient(comment));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});
