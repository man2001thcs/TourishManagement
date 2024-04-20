import { createReducer, on } from "@ngrx/store";
import * as BooklistAction from "./login.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  loginProfile: any;
}

export const initialState: State = {
  resultCd: 0,
  loginProfile: null,
};

export const reducer = createReducer(
  initialState,

  on(BooklistAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(BooklistAction.resetLogin, (state) => ({
    ...state,
    loginProfile: null,
  })),

  on(BooklistAction.login, (state, { payload }) => ({
    ...state,
  })),

  on(BooklistAction.loginSuccess, (state, { response }) => ({
    ...state,
    loginProfile: response.data,
  })),

  on(BooklistAction.loginFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(BooklistAction.loginSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  }))
);
