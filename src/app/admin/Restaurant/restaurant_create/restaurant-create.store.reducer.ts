import { createReducer, on } from '@ngrx/store';
import * as RestaurantAction from './restaurant-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  Restaurant: any;
  createStatus: any
}

export const initialState: State = {
  Restaurant: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(RestaurantAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestaurantAction.createRestaurant, (state, { payload }) => ({
    ...state,
  })),

  on(RestaurantAction.createRestaurantSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(RestaurantAction.createRestaurantFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestaurantAction.createRestaurantSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestaurantAction.resetRestaurant, (state) => ({
    ...state,
    Restaurant: null,
    createStatus: null
  }))
);
