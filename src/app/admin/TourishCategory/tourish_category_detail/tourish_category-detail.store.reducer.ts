import { createReducer, on } from '@ngrx/store';
import * as TourishCategoryAction from './tourish_category-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  tourishCategory: any;
  tourishCategoryReturn: any;
}

export const initialState: State = {
  tourishCategory: null,
  resultCd: 0,
  tourishCategoryReturn: null
};

export const reducer = createReducer(
  initialState,

  on(TourishCategoryAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(TourishCategoryAction.getTourishCategory, (state, { payload }) => ({
    ...state,
  })),

  on(TourishCategoryAction.getTourishCategorySuccess, (state, { response }) => ({
    ...state,
    tourishCategory: response.data,
  })),

  on(TourishCategoryAction.getTourishCategoryFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(TourishCategoryAction.getTourishCategorySystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(TourishCategoryAction.editTourishCategory, (state, { payload }) => ({
    ...state,
  })),

  on(TourishCategoryAction.editTourishCategorySuccess, (state, { response }) => ({
    ...state,
    tourishCategoryReturn: response,
  })),

  on(TourishCategoryAction.editTourishCategoryFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(TourishCategoryAction.editTourishCategorySystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })), 

  on(TourishCategoryAction.resetTourishCategory, (state) => ({
    ...state,
    tourishCategory: null,
    tourishCategoryReturn: null
  }))
);
