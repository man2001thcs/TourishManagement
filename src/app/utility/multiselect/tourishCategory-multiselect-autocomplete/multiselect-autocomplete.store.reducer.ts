import { createReducer, on } from "@ngrx/store";
import * as TourishCategoryListAction from "./multiselect-autocomplete.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  tourishCategoryList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  tourishCategoryList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(TourishCategoryListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(TourishCategoryListAction.getTourishCategoryList, (state, { payload }) => ({
    ...state,
  })),

  on(TourishCategoryListAction.getTourishCategoryListSuccess, (state, { response }) => ({
    ...state,
    tourishCategoryList: response,
  })),

  on(TourishCategoryListAction.getTourishCategoryListFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(TourishCategoryListAction.getTourishCategoryListSystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(TourishCategoryListAction.resetTourishCategoryList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    tourishCategoryList: [],
    deleteStatus: null,
  }))
);
