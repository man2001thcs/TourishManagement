import { createReducer, on } from '@ngrx/store';
import * as HomeStayAction from './homeStay-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  homeStay: any;
  homeStayReturn: any;
}

export const initialState: State = {
  homeStay: null,
  resultCd: 0,
  homeStayReturn: null
};

export const reducer = createReducer(
  initialState,

  on(HomeStayAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HomeStayAction.getHomeStay, (state, { payload }) => ({
    ...state,
  })),

  on(HomeStayAction.getHomeStaySuccess, (state, { response }) => ({
    ...state,
    homeStay: response.data,
  })),

  on(HomeStayAction.getHomeStayFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HomeStayAction.getHomeStaySystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HomeStayAction.editHomeStay, (state, { payload }) => ({
    ...state,
  })),

  on(HomeStayAction.editHomeStaySuccess, (state, { response }) => ({
    ...state,
    homeStayReturn: response,
  })),

  on(HomeStayAction.editHomeStayFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HomeStayAction.editHomeStaySystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(HomeStayAction.resetHomeStay, (state) => ({
    ...state,
    homeStay: null,
    homeStayReturn: null
  }))
);
