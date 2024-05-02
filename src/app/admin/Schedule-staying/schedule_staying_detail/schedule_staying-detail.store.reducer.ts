import { createReducer, on } from '@ngrx/store';
import * as MovingScheduleAction from './schedule_staying-detail.store.action';
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

  on(MovingScheduleAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingScheduleAction.getMovingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(MovingScheduleAction.getMovingScheduleSuccess, (state, { response }) => ({
    ...state,
    movingSchedule: response.data,
  })),

  on(MovingScheduleAction.getMovingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingScheduleAction.getMovingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingScheduleAction.editMovingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(MovingScheduleAction.editMovingScheduleSuccess, (state, { response }) => ({
    ...state,
    movingScheduleReturn: response,
  })),

  on(MovingScheduleAction.editMovingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingScheduleAction.editMovingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(MovingScheduleAction.resetMovingSchedule, (state) => ({
    ...state,
    movingSchedule: null,
    movingScheduleReturn: null
  }))
);
