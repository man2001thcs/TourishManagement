import { createReducer, on } from "@ngrx/store";
import * as HomeStayListAction from "./homeStay-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  homeStayList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  homeStayList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(HomeStayListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(HomeStayListAction.getHomeStayList, (state, { payload }) => ({
    ...state,
  })),

  on(HomeStayListAction.getHomeStayListSuccess, (state, { response }) => ({
    ...state,
    homeStayList: response,
  })),

  on(HomeStayListAction.getHomeStayListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HomeStayListAction.getHomeStayListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HomeStayListAction.deleteHomeStay, (state, { payload }) => ({
    ...state,
  })),

  on(HomeStayListAction.deleteHomeStaySuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(HomeStayListAction.deleteHomeStayFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(HomeStayListAction.deleteHomeStaySystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(HomeStayListAction.resetHomeStayList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    homeStayList: [],
    deleteStatus: null,
  }))
);
