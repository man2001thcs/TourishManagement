import { createReducer, on } from "@ngrx/store";
import * as RestaurantListAction from "./restaurant-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  restaurantList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  restaurantList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(RestaurantListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestaurantListAction.getRestaurantList, (state, { payload }) => ({
    ...state,
  })),

  on(RestaurantListAction.getRestaurantListSuccess, (state, { response }) => ({
    ...state,
    restaurantList: response,
  })),

  on(RestaurantListAction.getRestaurantListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestaurantListAction.getRestaurantListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestaurantListAction.deleteRestaurant, (state, { payload }) => ({
    ...state,
  })),

  on(RestaurantListAction.deleteRestaurantSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(RestaurantListAction.deleteRestaurantFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestaurantListAction.deleteRestaurantSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestaurantListAction.resetRestaurantList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    restaurantList: [],
    deleteStatus: null,
  }))
);
