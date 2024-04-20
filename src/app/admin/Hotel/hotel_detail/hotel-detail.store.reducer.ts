import { createReducer, on } from '@ngrx/store';
import * as HotelAction from './hotel-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  hotel: any;
  hotelReturn: any;
}

export const initialState: State = {
  hotel: null,
  resultCd: 0,
  hotelReturn: null
};

export const reducer = createReducer(
  initialState,

  on(HotelAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HotelAction.getHotel, (state, { payload }) => ({
    ...state,
  })),

  on(HotelAction.getHotelSuccess, (state, { response }) => ({
    ...state,
    hotel: response.data,
  })),

  on(HotelAction.getHotelFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HotelAction.getHotelSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HotelAction.editHotel, (state, { payload }) => ({
    ...state,
  })),

  on(HotelAction.editHotelSuccess, (state, { response }) => ({
    ...state,
    hotelReturn: response,
  })),

  on(HotelAction.editHotelFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HotelAction.editHotelSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(HotelAction.resetHotel, (state) => ({
    ...state,
    hotel: null,
    hotelReturn: null
  }))
);
