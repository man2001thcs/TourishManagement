import { createReducer, on } from '@ngrx/store';
import * as PassengerCarAction from './passenger_car-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  PassengerCar: any;
  createStatus: any
}

export const initialState: State = {
  PassengerCar: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(PassengerCarAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(PassengerCarAction.createPassengerCar, (state, { payload }) => ({
    ...state,
  })),

  on(PassengerCarAction.createPassengerCarSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(PassengerCarAction.createPassengerCarFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(PassengerCarAction.createPassengerCarSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(PassengerCarAction.resetPassengerCar, (state) => ({
    ...state,
    PassengerCar: null,
    createStatus: null
  }))
);
