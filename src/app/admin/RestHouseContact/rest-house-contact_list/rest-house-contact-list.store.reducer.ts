import { createReducer, on } from "@ngrx/store";
import * as RestHouseContactListAction from "./rest-house-contact-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  RestHouseContactList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  RestHouseContactList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(RestHouseContactListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(RestHouseContactListAction.getRestHouseContactList, (state, { payload }) => ({
    ...state,
  })),

  on(RestHouseContactListAction.getRestHouseContactListSuccess, (state, { response }) => ({
    ...state,
    RestHouseContactList: response,
  })),

  on(RestHouseContactListAction.getRestHouseContactListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestHouseContactListAction.getRestHouseContactListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestHouseContactListAction.deleteRestHouseContact, (state, { payload }) => ({
    ...state,
  })),

  on(RestHouseContactListAction.deleteRestHouseContactSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(RestHouseContactListAction.deleteRestHouseContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(RestHouseContactListAction.deleteRestHouseContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(RestHouseContactListAction.resetRestHouseContactList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    RestHouseContactList: [],
    deleteStatus: null,
  }))
);
