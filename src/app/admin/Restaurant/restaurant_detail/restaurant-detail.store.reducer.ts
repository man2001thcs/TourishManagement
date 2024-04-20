import { createReducer, on } from '@ngrx/store';
import * as RestaurantAction from './restaurant-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  restaurant: any;
  restaurantReturn: any;
}

export const initialState: State = {
  restaurant: null,
  resultCd: 0,
  restaurantReturn: null
};

export const reducer = createReducer(
  initialState,

  on(RestaurantAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestaurantAction.getRestaurant, (state, { payload }) => ({
    ...state,
  })),

  on(RestaurantAction.getRestaurantSuccess, (state, { response }) => ({
    ...state,
    restaurant: response.data,
  })),

  on(RestaurantAction.getRestaurantFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestaurantAction.getRestaurantSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestaurantAction.editRestaurant, (state, { payload }) => ({
    ...state,
  })),

  on(RestaurantAction.editRestaurantSuccess, (state, { response }) => ({
    ...state,
    restaurantReturn: response,
  })),

  on(RestaurantAction.editRestaurantFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestaurantAction.editRestaurantSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(RestaurantAction.resetRestaurant, (state) => ({
    ...state,
    restaurant: null,
    restaurantReturn: null
  }))
);
