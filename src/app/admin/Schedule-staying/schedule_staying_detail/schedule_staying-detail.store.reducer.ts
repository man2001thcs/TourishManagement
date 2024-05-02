import { createReducer, on } from '@ngrx/store';
import * as StayingScheduleAction from './schedule_staying-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  movingSchedule: any;
  movingScheduleReturn: any;
}

export const initialState: State = {
  movingSchedule: null,
  resultCd: 0,
  movingScheduleReturn: null
};

export const reducer = createReducer(
  initialState,

  on(StayingScheduleAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(StayingScheduleAction.getStayingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(StayingScheduleAction.getStayingScheduleSuccess, (state, { response }) => ({
    ...state,
    movingSchedule: response.data,
  })),

  on(StayingScheduleAction.getStayingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingScheduleAction.getStayingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(StayingScheduleAction.editStayingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(StayingScheduleAction.editStayingScheduleSuccess, (state, { response }) => ({
    ...state,
    movingScheduleReturn: response,
  })),

  on(StayingScheduleAction.editStayingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingScheduleAction.editStayingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(StayingScheduleAction.resetStayingSchedule, (state) => ({
    ...state,
    movingSchedule: null,
    movingScheduleReturn: null
  }))
);
