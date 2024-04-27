import { createReducer, on } from '@ngrx/store';
import * as RestHouseContactAction from './rest-house-contact-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  RestHouseContact: any;
  createStatus: any
}

export const initialState: State = {
  RestHouseContact: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(RestHouseContactAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestHouseContactAction.createRestHouseContact, (state, { payload }) => ({
    ...state,
  })),

  on(RestHouseContactAction.createRestHouseContactSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(RestHouseContactAction.createRestHouseContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestHouseContactAction.createRestHouseContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestHouseContactAction.resetRestHouseContact, (state) => ({
    ...state,
    RestHouseContact: null,
    createStatus: null
  }))
);
