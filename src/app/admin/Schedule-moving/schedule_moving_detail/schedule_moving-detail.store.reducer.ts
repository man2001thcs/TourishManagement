import { createReducer, on } from '@ngrx/store';
import * as PassengerCarAction from './passenger_car-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  passengerCar: any;
  passengerCarReturn: any;
}

export const initialState: State = {
  passengerCar: null,
  resultCd: 0,
  passengerCarReturn: null
};

export const reducer = createReducer(
  initialState,

  on(PassengerCarAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(PassengerCarAction.getPassengerCar, (state, { payload }) => ({
    ...state,
  })),

  on(PassengerCarAction.getPassengerCarSuccess, (state, { response }) => ({
    ...state,
    passengerCar: response.data,
  })),

  on(PassengerCarAction.getPassengerCarFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(PassengerCarAction.getPassengerCarSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(PassengerCarAction.editPassengerCar, (state, { payload }) => ({
    ...state,
  })),

  on(PassengerCarAction.editPassengerCarSuccess, (state, { response }) => ({
    ...state,
    passengerCarReturn: response,
  })),

  on(PassengerCarAction.editPassengerCarFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(PassengerCarAction.editPassengerCarSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(PassengerCarAction.resetPassengerCar, (state) => ({
    ...state,
    passengerCar: null,
    passengerCarReturn: null
  }))
);
