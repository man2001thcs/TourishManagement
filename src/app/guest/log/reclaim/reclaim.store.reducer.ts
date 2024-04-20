import { createReducer, on } from "@ngrx/store";
import * as AuthorAction from "./reclaim.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  userReturn: any;
  assignPasswordReturn: any;
}

export const initialState: State = {
  userReturn: null,
  assignPasswordReturn: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(AuthorAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AuthorAction.reclaimUser, (state, { payload }) => ({
    ...state,
  })),

  on(AuthorAction.reclaimUserSuccess, (state, { response }) => ({
    ...state,
    userReturn: response,
  })),

  on(AuthorAction.reclaimUserFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AuthorAction.reclaimUserSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AuthorAction.assignPassword, (state, { payload }) => ({
    ...state,
  })),

  on(AuthorAction.assignPasswordSuccess, (state, { response }) => ({
    ...state,
    assignPasswordReturn: response,
  })),

  on(AuthorAction.assignPasswordFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AuthorAction.assignPasswordSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AuthorAction.resetUser, (state) => ({
    ...state,
    userReturn: null,
    assignPasswordReturn: null
  }))
);
