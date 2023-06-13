import { Length, IsInt, Min, Max } from 'class-validator';
import { CommentLength } from '../comment.constants.js';
import { OfferRating } from '../../offer/offer.constants.js';

export default class CreateCommentDTO {
  @Length(CommentLength.Min, CommentLength.Max, {
    message: `Minimum comment length must be ${CommentLength.Min}, max ${CommentLength.Max}`,
  })
  public text!: string;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(OfferRating.Min, { message: `Minimum rating is ${OfferRating.Min}` })
  @Max(OfferRating.Max, { message: `Maximum rating is ${OfferRating.Max}` })
  public rating!: number;

  public offerId!: string;

  public userId!: string;
}
