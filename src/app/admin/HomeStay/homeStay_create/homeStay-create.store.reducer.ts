import { createReducer, on } from '@ngrx/store';
import * as HomeStayAction from './homeStay-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  homeStay: any;
  createStatus: any
}

export const initialState: State = {
  homeStay: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(HomeStayAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HomeStayAction.createHomeStay, (state, { payload }) => ({
    ...state,
  })),

  on(HomeStayAction.createHomeStaySuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(HomeStayAction.createHomeStayFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HomeStayAction.createHomeStaySystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HomeStayAction.resetHomeStay, (state) => ({
    ...state,
    HomeStay: null,
    createStatus: null
  }))
);
