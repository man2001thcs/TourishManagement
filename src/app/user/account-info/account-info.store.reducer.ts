import { createReducer, on } from '@ngrx/store';
import * as AccountAction from './account-info.store.action';
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

  on(AccountAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AccountAction.getAccount, (state, { payload }) => ({
    ...state,
  })),

  on(AccountAction.getAccountSuccess, (state, { response }) => ({
    ...state,
    user: response.data,
  })),

  on(AccountAction.getAccountFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(AccountAction.getAccountSystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(AccountAction.editAccount, (state, { payload }) => ({
    ...state,
  })),

  on(AccountAction.editAccountSuccess, (state, { response }) => ({
    ...state,
    userReturn: response,
  })),

  on(AccountAction.editAccountFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(AccountAction.editAccountSystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })), 

  on(AccountAction.resetAccount, (state) => ({
    ...state,
    user: null,
    userReturn: null
  }))
);
