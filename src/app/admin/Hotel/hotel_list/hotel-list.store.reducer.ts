import { createReducer, on } from "@ngrx/store";
import * as HotelListAction from "./hotel-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  hotelList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  hotelList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(HotelListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HotelListAction.getHotelList, (state, { payload }) => ({
    ...state,
  })),

  on(HotelListAction.getHotelListSuccess, (state, { response }) => ({
    ...state,
    hotelList: response,
  })),

  on(HotelListAction.getHotelListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HotelListAction.getHotelListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HotelListAction.deleteHotel, (state, { payload }) => ({
    ...state,
  })),

  on(HotelListAction.deleteHotelSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(HotelListAction.deleteHotelFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HotelListAction.deleteHotelSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HotelListAction.resetHotelList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    hotelList: [],
    deleteStatus: null,
  }))
);
