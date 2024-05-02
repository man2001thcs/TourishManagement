import { createReducer, on } from '@ngrx/store';
import * as StayingScheduleAction from './schedule_staying-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  StayingSchedule: any;
  createStatus: any
}

export const initialState: State = {
  StayingSchedule: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(StayingScheduleAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(StayingScheduleAction.createStayingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(StayingScheduleAction.createStayingScheduleSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(StayingScheduleAction.createStayingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingScheduleAction.createStayingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(StayingScheduleAction.resetStayingSchedule, (state) => ({
    ...state,
    StayingSchedule: null,
    createStatus: null
  }))
);
