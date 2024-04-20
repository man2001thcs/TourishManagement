import { createReducer, on } from "@ngrx/store";
import * as UserListAction from "./user-list.store.action";
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

  on(UserListAction.deleteUser, (state, { payload }) => ({
    ...state,
  })),

  on(UserListAction.deleteUserSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(UserListAction.deleteUserFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(UserListAction.deleteUserSystemFailed, (state, { error }) => ({
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
