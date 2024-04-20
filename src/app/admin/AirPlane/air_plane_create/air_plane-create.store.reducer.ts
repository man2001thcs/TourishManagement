import { createReducer, on } from '@ngrx/store';
import * as AirPlaneAction from './air_plane-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  AirPlane: any;
  createStatus: any
}

export const initialState: State = {
  AirPlane: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(AirPlaneAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AirPlaneAction.createAirPlane, (state, { payload }) => ({
    ...state,
  })),

  on(AirPlaneAction.createAirPlaneSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(AirPlaneAction.createAirPlaneFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AirPlaneAction.createAirPlaneSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AirPlaneAction.resetAirPlane, (state) => ({
    ...state,
    AirPlane: null,
    createStatus: null
  }))
);
