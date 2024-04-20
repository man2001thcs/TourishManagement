import { createReducer, on } from "@ngrx/store";
import * as MovingListAction from "./multiselect-autocomplete.store.action";
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

  on(MovingListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingListAction.getMovingList, (state, { payload }) => ({
    ...state,
  })),

  on(MovingListAction.getMovingListSuccess, (state, { response }) => ({
    ...state,
    entityList: response,
  })),

  on(MovingListAction.getMovingListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingListAction.getMovingListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingListAction.resetMovingList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    entityList: [],
    deleteStatus: null,
  }))
);
