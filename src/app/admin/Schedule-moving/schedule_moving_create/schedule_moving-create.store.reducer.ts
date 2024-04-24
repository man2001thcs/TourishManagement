import { createReducer, on } from '@ngrx/store';
import * as MovingScheduleAction from './schedule_moving-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  MovingSchedule: any;
  createStatus: any
}

export const initialState: State = {
  MovingSchedule: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(MovingScheduleAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingScheduleAction.createMovingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(MovingScheduleAction.createMovingScheduleSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(MovingScheduleAction.createMovingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingScheduleAction.createMovingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingScheduleAction.resetMovingSchedule, (state) => ({
    ...state,
    MovingSchedule: null,
    createStatus: null
  }))
);
