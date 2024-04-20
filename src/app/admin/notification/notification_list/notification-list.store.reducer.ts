import { createReducer, on } from "@ngrx/store";
import * as NotificationListAction from "./notification-list.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  notificationList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  notificationList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(NotificationListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(NotificationListAction.getNotificationList, (state, { payload }) => ({
    ...state,
  })),

  on(NotificationListAction.getNotificationListSuccess, (state, { response }) => ({
    ...state,
    notificationList: response,
  })),

  on(NotificationListAction.getNotificationListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(NotificationListAction.getNotificationListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(NotificationListAction.deleteNotification, (state, { payload }) => ({
    ...state,
  })),

  on(NotificationListAction.deleteNotificationSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(NotificationListAction.deleteNotificationFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(NotificationListAction.deleteNotificationSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(NotificationListAction.resetNotificationList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    notificationList: [],
    deleteStatus: null,
  }))
);
