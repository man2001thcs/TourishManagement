import { createReducer, on } from "@ngrx/store";
import * as AuthorAction from "./signIn-create.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  userReturn: any;
}

export const initialState: State = {
  userReturn: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(AuthorAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AuthorAction.createUser, (state, { payload }) => ({
    ...state,
  })),

  on(AuthorAction.createUserSuccess, (state, { response }) => ({
    ...state,
    userReturn: response,
  })),

  on(AuthorAction.createUserFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AuthorAction.createUserSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AuthorAction.resetUser, (state) => ({
    ...state,
    userReturn: null,
  }))
);
