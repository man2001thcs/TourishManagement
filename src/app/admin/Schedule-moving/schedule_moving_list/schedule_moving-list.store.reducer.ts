import { createReducer, on } from "@ngrx/store";
import * as PassengerCarListAction from "./passenger_car-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  passengerCarList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  passengerCarList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(PassengerCarListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(PassengerCarListAction.getPassengerCarList, (state, { payload }) => ({
    ...state,
  })),

  on(PassengerCarListAction.getPassengerCarListSuccess, (state, { response }) => ({
    ...state,
    passengerCarList: response,
  })),

  on(PassengerCarListAction.getPassengerCarListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(PassengerCarListAction.getPassengerCarListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(PassengerCarListAction.deletePassengerCar, (state, { payload }) => ({
    ...state,
  })),

  on(PassengerCarListAction.deletePassengerCarSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(PassengerCarListAction.deletePassengerCarFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(PassengerCarListAction.deletePassengerCarSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(PassengerCarListAction.resetPassengerCarList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    passengerCarList: [],
    deleteStatus: null,
  }))
);
