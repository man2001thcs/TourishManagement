import { createReducer, on } from '@ngrx/store';
import * as ReceiptAction from './receipt-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  Receipt: any;
  createStatus: any
}

export const initialState: State = {
  Receipt: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(ReceiptAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(ReceiptAction.createReceipt, (state, { payload }) => ({
    ...state,
  })),

  on(ReceiptAction.createReceiptSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(ReceiptAction.createReceiptFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ReceiptAction.createReceiptSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ReceiptAction.resetReceipt, (state) => ({
    ...state,
    Receipt: null,
    createStatus: null
  }))
);
