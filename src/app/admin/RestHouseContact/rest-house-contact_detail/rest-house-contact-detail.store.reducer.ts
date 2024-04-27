import { createReducer, on } from '@ngrx/store';
import * as RestHouseContactAction from './rest-house-contact-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  RestHouseContact: any;
  RestHouseContactReturn: any;
}

export const initialState: State = {
  RestHouseContact: null,
  resultCd: 0,
  RestHouseContactReturn: null
};

export const reducer = createReducer(
  initialState,

  on(RestHouseContactAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestHouseContactAction.getRestHouseContact, (state, { payload }) => ({
    ...state,
  })),

  on(RestHouseContactAction.getRestHouseContactSuccess, (state, { response }) => ({
    ...state,
    RestHouseContact: response.data,
  })),

  on(RestHouseContactAction.getRestHouseContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestHouseContactAction.getRestHouseContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestHouseContactAction.editRestHouseContact, (state, { payload }) => ({
    ...state,
  })),

  on(RestHouseContactAction.editRestHouseContactSuccess, (state, { response }) => ({
    ...state,
    RestHouseContactReturn: response,
  })),

  on(RestHouseContactAction.editRestHouseContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestHouseContactAction.editRestHouseContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(RestHouseContactAction.resetRestHouseContact, (state) => ({
    ...state,
    RestHouseContact: null,
    RestHouseContactReturn: null
  }))
);
