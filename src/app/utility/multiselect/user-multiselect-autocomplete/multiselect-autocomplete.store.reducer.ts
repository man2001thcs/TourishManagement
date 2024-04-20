import { createReducer, on } from "@ngrx/store";
import * as UserListAction from "./multiselect-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  userList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  userList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(UserListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(UserListAction.getUserList, (state, { payload }) => ({
    ...state,
  })),

  on(UserListAction.getUserListSuccess, (state, { response }) => ({
    ...state,
    userList: response,
  })),

  on(UserListAction.getUserListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(UserListAction.getUserListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(UserListAction.resetUserList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    userList: [],
    deleteStatus: null,
  }))
);
