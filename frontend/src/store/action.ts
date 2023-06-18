import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserAuth, User, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode, ImageFieldName } from '../const';
import { Token } from '../utils';
import OfferDto from '../dto/offer/offer.dto';
import { adaptCommentToClient, adaptCommentsToClient, adaptOfferToClient, adaptOffersToClient, adaptUserToClient } from '../utils/adapters/adaptersToClient';
import { adaptAvatarToServer, adaptCreateCommentToServer, adaptCreateOfferToServer, adaptEditOfferToServer, adaptImagesToServer, adaptPreviewImageToServer, adaptSignupToServer } from '../utils/adapters/adaptersToServer';
import CommentDto from '../dto/comments/comment.dto';
import UserDto from '../dto/user/user.dto';
import CreateUserWithIdDto from '../dto/user/create-user-with-id.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Offers);
    return adaptOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(ApiRoute.Favorite);

    return adaptOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NOT_FOUND) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<OfferDto>(ApiRoute.Offers, adaptCreateOfferToServer(newOffer));

    if (data) {

      const postImageApiRoute = `${ApiRoute.Offers}/${data.id}/${ImageFieldName.Preview}`;
      await api.post(postImageApiRoute, adaptPreviewImageToServer(newOffer.previewImage), {
        headers: { 'Content-Type': 'multipart/form-data boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
      });

      const postImagesApiRoute = `${ApiRoute.Offers}/${data.id}/${ImageFieldName.Image}`;
      await api.post(postImagesApiRoute, adaptImagesToServer(newOffer.images), {
        headers: { 'Content-Type': 'multipart/form-data boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
      });
    }

    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const editOffer = createAsyncThunk<Offer,Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;

    const postImageApiRoute = `${ApiRoute.Offers}/${offer.id}/${ImageFieldName.Preview}`;
    await api.post(postImageApiRoute, adaptPreviewImageToServer(offer.previewImage), {
      headers: { 'Content-Type': 'multipart/form-data boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    });

    const postImagesApiRoute = `${ApiRoute.Offers}/${offer.id}/${ImageFieldName.Image}`;
    await api.post(postImagesApiRoute, adaptImagesToServer(offer.images), {
      headers: { 'Content-Type': 'multipart/form-data boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    });

    const { data } = await api.patch<OfferDto>(`${ApiRoute.Offers}/${offer.id}`, adaptEditOfferToServer(offer));
    history.push(`${AppRoute.Property}/${data.id}`);

    return adaptOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<OfferDto[]>(`${ApiRoute.Premium}?city=${cityName}`);

    return adaptOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${ApiRoute.Comments}/${id}`);

    return adaptCommentsToClient(data);
  });

export const fetchUserStatus = createAsyncThunk<User, undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<UserDto>(ApiRoute.Login);

      return adaptUserToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<User & { token: string }>(ApiRoute.Login, { email, password });
    const { token } = data;

    Token.save(token);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {
    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async (userData, { extra }) => {
    const { api, history } = extra;

    const postData = await api.post<CreateUserWithIdDto>(ApiRoute.Register, adaptSignupToServer(userData));

    if (userData.avatar && postData.status === HttpCode.CREATED) {
      const postAvatarApiRoute = `${ApiRoute.Users}/${postData.data.id}/${ImageFieldName.Avatar}`;

      await api.post(postAvatarApiRoute, adaptAvatarToServer(userData.avatar), {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    }

    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async (commentData, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<CommentDto>(`${ApiRoute.Comments}/${commentData.id}`, adaptCreateCommentToServer(commentData));

    return adaptCommentToClient(data);
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<OfferDto>(
      `${ApiRoute.Favorite}/${id}?status=true`
    );

    return adaptOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<OfferDto>(
      `${ApiRoute.Favorite}/${id}?status=false`
    );

    return adaptOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.UNAUTHORIZED) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
