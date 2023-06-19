import {CommentAuth, NewOffer, Offer, UserRegister} from '../../types/types.js';
import {HomeType} from '../../types/home-type.enum.js';
import CreateUserDto from '../../dto/user/create-user.dto.js';
import {getTime} from '../utils';
import UpdateOfferDto from '../../dto/offer/update-offer.js';
import { ImageFieldName } from '../../const';
import CreateCommentDTO from '../../dto/comments/create-comment.dto.js';
import CreateOfferDto from '../../dto/offer/create-offer.js';
import { CityType } from '../../types/city-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    name: user.name,
    email: user.email,
    userStatus: user.type,
    avatarUrl:'',
    password: user.password,
  });

export const adaptEditOfferToServer =
  (offer: Offer): UpdateOfferDto => ({
    price: offer.price,
    rating:  offer.rating,
    title:  offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: offer.city.name as CityType,
    location: offer.location,
    type: offer.type as HomeType,
    rooms: offer.bedrooms,
    description: offer.description,
    goods:  offer.goods?.map((good) => good as GoodType),
    guests: offer.maxAdults
  });

export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    price: offer.price,
    title: offer.title,
    postDate: getTime(),
    isPremium: offer.isPremium,
    city: offer.city.name as CityType,
    type: offer.type as HomeType,
    rooms: offer.bedrooms,
    description: offer.description,
    goods:  offer.goods?.map((good) => good as GoodType),
    guests: offer.maxAdults,
    isFavorite: false,
    rating: 0,
    location: offer.location,
  });

export const adaptCreateCommentToServer =
  (comment: CommentAuth): CreateCommentDTO => ({
    text: comment.comment,
    rating: comment.rating,
    offerId: comment.id
  });

export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set(ImageFieldName.Avatar, file);

    return formData;
  };

export const adaptPreviewImageToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set(ImageFieldName.Preview, file);
    return formData;
  };

export const adaptImagesToServer =
  (files: string[]) => {
    const formData = new FormData();

    for(let i = 0; i < files.length; i++){
      formData.append(ImageFieldName.Image,files[i]);
    }
    return formData;
  };
