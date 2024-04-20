import { createReducer, on } from "@ngrx/store";
import * as AirPlaneListAction from "./air_plane-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  airPlaneList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  airPlaneList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(AirPlaneListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(AirPlaneListAction.getAirPlaneList, (state, { payload }) => ({
    ...state,
  })),

  on(AirPlaneListAction.getAirPlaneListSuccess, (state, { response }) => ({
    ...state,
    airPlaneList: response,
  })),

  on(AirPlaneListAction.getAirPlaneListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AirPlaneListAction.getAirPlaneListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AirPlaneListAction.deleteAirPlane, (state, { payload }) => ({
    ...state,
  })),

  on(AirPlaneListAction.deleteAirPlaneSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(AirPlaneListAction.deleteAirPlaneFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(AirPlaneListAction.deleteAirPlaneSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(AirPlaneListAction.resetAirPlaneList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    airPlaneList: [],
    deleteStatus: null,
  }))
);
