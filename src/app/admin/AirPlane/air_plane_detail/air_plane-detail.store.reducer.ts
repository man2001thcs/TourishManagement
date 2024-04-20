import { createReducer, on } from '@ngrx/store';
import * as AirPlaneAction from './air_plane-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  airPlane: any;
  airPlaneReturn: any;
}

export const initialState: State = {
  airPlane: null,
  resultCd: 0,
  airPlaneReturn: null
};

export const reducer = createReducer(
  initialState,

  on(AirPlaneAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AirPlaneAction.getAirPlane, (state, { payload }) => ({
    ...state,
  })),

  on(AirPlaneAction.getAirPlaneSuccess, (state, { response }) => ({
    ...state,
    airPlane: response.data,
  })),

  on(AirPlaneAction.getAirPlaneFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AirPlaneAction.getAirPlaneSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AirPlaneAction.editAirPlane, (state, { payload }) => ({
    ...state,
  })),

  on(AirPlaneAction.editAirPlaneSuccess, (state, { response }) => ({
    ...state,
    airPlaneReturn: response,
  })),

  on(AirPlaneAction.editAirPlaneFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AirPlaneAction.editAirPlaneSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(AirPlaneAction.resetAirPlane, (state) => ({
    ...state,
    airPlane: null,
    airPlaneReturn: null
  }))
);
