import { createReducer, on } from '@ngrx/store';
import * as ReceiptAction from './receipt-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  hotel: any;
  hotelReturn: any;
}

export const initialState: State = {
  hotel: null,
  resultCd: 0,
  hotelReturn: null
};

export const reducer = createReducer(
  initialState,

  on(ReceiptAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(ReceiptAction.getReceipt, (state, { payload }) => ({
    ...state,
  })),

  on(ReceiptAction.getReceiptSuccess, (state, { response }) => ({
    ...state,
    hotel: response.data,
  })),

  on(ReceiptAction.getReceiptFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ReceiptAction.getReceiptSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ReceiptAction.editReceipt, (state, { payload }) => ({
    ...state,
  })),

  on(ReceiptAction.editReceiptSuccess, (state, { response }) => ({
    ...state,
    hotelReturn: response,
  })),

  on(ReceiptAction.editReceiptFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ReceiptAction.editReceiptSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(ReceiptAction.resetReceipt, (state) => ({
    ...state,
    hotel: null,
    messageCode: null,
    hotelReturn: null
  }))
);
