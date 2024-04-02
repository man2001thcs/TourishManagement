import { createReducer, on } from "@ngrx/store";
import * as GuestMessageConHistoryListAction from "./chat_con_his_list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  guestMessageConHistoryList: any;
  pageNumber: number;
  pageOffset: number;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  guestMessageConHistoryList: [],
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(GuestMessageConHistoryListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(GuestMessageConHistoryListAction.getGuestMessageConHistoryList, (state, { payload }) => ({
    ...state,
  })),

  on(GuestMessageConHistoryListAction.getGuestMessageConHistoryListSuccess, (state, { response }) => ({
    ...state,
    guestMessageConHistoryList: response,
  })),

  on(GuestMessageConHistoryListAction.getGuestMessageConHistoryListFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(GuestMessageConHistoryListAction.getGuestMessageConHistoryListSystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(GuestMessageConHistoryListAction.resetGuestMessageConHistoryList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    guestMessageConHistoryList: [],
    deleteStatus: null,
  }))
);
