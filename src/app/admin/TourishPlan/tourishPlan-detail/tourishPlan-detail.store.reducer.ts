import { createReducer, on } from '@ngrx/store';
import * as TourishPlanAction from './tourishPlan-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  tourishPlan: any;
  tourishPlanReturn: any;
}

export const initialState: State = {
  tourishPlan: null,
  resultCd: 0,
  tourishPlanReturn: null
};

export const reducer = createReducer(
  initialState,

  on(TourishPlanAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(TourishPlanAction.getTourishPlan, (state, { payload }) => ({
    ...state,
  })),

  on(TourishPlanAction.getTourishPlanSuccess, (state, { response }) => ({
    ...state,
    tourishPlan: response.data,
  })),

  on(TourishPlanAction.getTourishPlanFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(TourishPlanAction.getTourishPlanSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(TourishPlanAction.editTourishPlan, (state, { payload }) => ({
    ...state,
  })),

  on(TourishPlanAction.editTourishPlanSuccess, (state, { response }) => ({
    ...state,
    tourishPlanReturn: response,
  })),

  on(TourishPlanAction.editTourishPlanFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(TourishPlanAction.editTourishPlanSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(TourishPlanAction.resetTourishPlan, (state) => ({
    ...state,
    tourishPlan: null,
    tourishPlanReturn: null
  }))
);
