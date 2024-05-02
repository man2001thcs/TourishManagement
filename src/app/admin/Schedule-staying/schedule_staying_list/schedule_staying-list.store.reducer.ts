import { createReducer, on } from "@ngrx/store";
import * as StayingScheduleListAction from "./schedule_staying-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  stayingScheduleList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  stayingScheduleList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(StayingScheduleListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(StayingScheduleListAction.getStayingScheduleList, (state, { payload }) => ({
    ...state,
  })),

  on(StayingScheduleListAction.getStayingScheduleListSuccess, (state, { response }) => ({
    ...state,
    stayingScheduleList: response,
  })),

  on(StayingScheduleListAction.getStayingScheduleListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingScheduleListAction.getStayingScheduleListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(StayingScheduleListAction.deleteStayingSchedule, (state, { payload }) => ({
    ...state,
  })),

  on(StayingScheduleListAction.deleteStayingScheduleSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(StayingScheduleListAction.deleteStayingScheduleFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(StayingScheduleListAction.deleteStayingScheduleSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(StayingScheduleListAction.resetStayingScheduleList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    stayingScheduleList: [],
    deleteStatus: null,
  }))
);
