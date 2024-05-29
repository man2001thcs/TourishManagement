import { createReducer, on } from '@ngrx/store';
import * as UserAction from './user-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  user: any;
  userReturn: any;
}

export const initialState: State = {
  user: null,
  resultCd: 0,
  userReturn: null
};

export const reducer = createReducer(
  initialState,

  on(UserAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(UserAction.getUser, (state, { payload }) => ({
    ...state,
  })),

  on(UserAction.getUserSuccess, (state, { response }) => ({
    ...state,
    user: response.data,
  })),

  on(UserAction.getUserFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(UserAction.getUserSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(UserAction.editUser, (state, { payload }) => ({
    ...state,
  })),

  on(UserAction.editUserSuccess, (state, { response }) => ({
    ...state,
    userReturn: response,
  })),

  on(UserAction.editUserFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(UserAction.editUserSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(UserAction.resetUser, (state) => ({
    ...state,
    user: null,
    userReturn: null,
    messageCode: null,
    error: null
  }))
);
