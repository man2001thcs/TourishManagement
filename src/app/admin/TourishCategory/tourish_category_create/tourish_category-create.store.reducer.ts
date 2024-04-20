import { createReducer, on } from '@ngrx/store';
import * as TourishCategoryAction from './tourish_category-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  TourishCategory: any;
  createStatus: any
}

export const initialState: State = {
  TourishCategory: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(TourishCategoryAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(TourishCategoryAction.createTourishCategory, (state, { payload }) => ({
    ...state,
  })),

  on(TourishCategoryAction.createTourishCategorySuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(TourishCategoryAction.createTourishCategoryFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(TourishCategoryAction.createTourishCategorySystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(TourishCategoryAction.resetTourishCategory, (state) => ({
    ...state,
    TourishCategory: null,
    createStatus: null
  }))
);
