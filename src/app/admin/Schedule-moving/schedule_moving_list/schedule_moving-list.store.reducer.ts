import { createReducer, on } from "@ngrx/store";
import * as MovingScheduleListAction from "./schedule_moving-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  movingScheduleList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  movingScheduleList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(MovingScheduleListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingScheduleListAction.getMovingScheduleList, (state, { payload }) => ({
    ...state,
  })),

  on(MovingScheduleListAction.getMovingScheduleListSuccess, (state, { response }) => ({
    ...state,
    movingScheduleList: response,
  })),

  on(MovingScheduleListAction.getMovingScheduleListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingScheduleListAction.getMovingScheduleListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingScheduleListAction.deleteMovingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(MovingScheduleListAction.deleteMovingScheduleSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(MovingScheduleListAction.deleteMovingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingScheduleListAction.deleteMovingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingScheduleListAction.resetMovingScheduleList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    movingScheduleList: [],
    deleteStatus: null,
  }))
);
