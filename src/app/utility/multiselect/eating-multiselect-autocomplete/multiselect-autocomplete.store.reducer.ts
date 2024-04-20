import { createReducer, on } from "@ngrx/store";
import * as EatingListAction from "./multiselect-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  entityList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  entityList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(EatingListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(EatingListAction.getEatingList, (state, { payload }) => ({
    ...state,
  })),

  on(EatingListAction.getEatingListSuccess, (state, { response }) => ({
    ...state,
    entityList: response,
  })),

  on(EatingListAction.getEatingListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(EatingListAction.getEatingListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(EatingListAction.resetEatingList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    entityList: [],
    deleteStatus: null,
  }))
);
