import { createReducer, on } from "@ngrx/store";
import * as ReceiptListAction from "./receipt-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  hotelList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  hotelList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(ReceiptListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(ReceiptListAction.getReceiptList, (state, { payload }) => ({
    ...state,
  })),

  on(ReceiptListAction.getReceiptListSuccess, (state, { response }) => ({
    ...state,
    hotelList: response,
  })),

  on(ReceiptListAction.getReceiptListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ReceiptListAction.getReceiptListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ReceiptListAction.deleteReceipt, (state, { payload }) => ({
    ...state,
  })),

  on(ReceiptListAction.deleteReceiptSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(ReceiptListAction.deleteReceiptFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ReceiptListAction.deleteReceiptSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ReceiptListAction.resetReceiptList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    hotelList: [],
    deleteStatus: null,
  }))
);
