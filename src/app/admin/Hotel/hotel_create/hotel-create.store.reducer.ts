import { createReducer, on } from '@ngrx/store';
import * as HotelAction from './hotel-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  Hotel: any;
  createStatus: any
}

export const initialState: State = {
  Hotel: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(HotelAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HotelAction.createHotel, (state, { payload }) => ({
    ...state,
  })),

  on(HotelAction.createHotelSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(HotelAction.createHotelFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HotelAction.createHotelSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HotelAction.resetHotel, (state) => ({
    ...state,
    Hotel: null,
    createStatus: null
  }))
);
