import { createReducer, on } from "@ngrx/store";
import * as StayingListAction from "./multiselect-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  entityList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  entityList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(StayingListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(StayingListAction.getStayingList, (state, { payload }) => ({
    ...state,
  })),

  on(StayingListAction.getStayingListSuccess, (state, { response }) => ({
    ...state,
    entityList: response,
  })),

  on(StayingListAction.getStayingListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingListAction.getStayingListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(StayingListAction.resetStayingList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    entityList: [],
    deleteStatus: null,
  }))
);
