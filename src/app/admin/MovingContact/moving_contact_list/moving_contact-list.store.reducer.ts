import { createReducer, on } from "@ngrx/store";
import * as MovingContactListAction from "./moving_contact-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  MovingContactList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  MovingContactList: [],
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
    MovingContactList: response,
  })),

  on(MovingContactListAction.getMovingContactListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactListAction.getMovingContactListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingContactListAction.deleteMovingContact, (state, { payload }) => ({
    ...state,
  })),

  on(MovingContactListAction.deleteMovingContactSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(MovingContactListAction.deleteMovingContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactListAction.deleteMovingContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingContactListAction.resetMovingContactList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    MovingContactList: [],
    deleteStatus: null,
  }))
);
