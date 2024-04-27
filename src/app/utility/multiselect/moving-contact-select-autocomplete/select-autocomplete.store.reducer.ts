import { createReducer, on } from "@ngrx/store";
import * as MovingContactListAction from "./select-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  movingscheduleList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  movingscheduleList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(MovingContactListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingContactListAction.getMovingContactList, (state, { payload }) => ({
    ...state,
  })),

  on(MovingContactListAction.getMovingContactListSuccess, (state, { response }) => ({
    ...state,
    movingscheduleList: response,
  })),

  on(MovingContactListAction.getMovingContactListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactListAction.getMovingContactListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingContactListAction.resetMovingContactList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    movingscheduleList: [],
    deleteStatus: null,
  }))
);
