import { createReducer, on } from "@ngrx/store";
import * as AuthorAction from "./tourishPlan-create.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  tourishPlanReturn: any;
}

export const initialState: State = {
  tourishPlanReturn: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(AuthorAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AuthorAction.createTourishPlan, (state, { payload }) => ({
    ...state,
  })),

  on(AuthorAction.createTourishPlanSuccess, (state, { response }) => ({
    ...state,
    tourishPlanReturn: response,
  })),

  on(AuthorAction.createTourishPlanFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AuthorAction.createTourishPlanSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AuthorAction.resetTourishPlan, (state) => ({
    ...state,
    tourishPlanReturn: null,
  }))
);
