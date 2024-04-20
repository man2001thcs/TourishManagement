import { createReducer, on } from "@ngrx/store";
import * as TourishPlanListAction from "./multiselect-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  tourishPlanList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  tourishPlanList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(TourishPlanListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(TourishPlanListAction.getTourishPlanList, (state, { payload }) => ({
    ...state,
  })),

  on(TourishPlanListAction.getTourishPlanListSuccess, (state, { response }) => ({
    ...state,
    tourishPlanList: response,
  })),

  on(TourishPlanListAction.getTourishPlanListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(TourishPlanListAction.getTourishPlanListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(TourishPlanListAction.resetTourishPlanList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    tourishPlanList: [],
    deleteStatus: null,
  }))
);
