import { createReducer, on } from '@ngrx/store';
import * as NotificationAction from './notification-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  notification: any;
  notificationReturn: any;
}

export const initialState: State = {
  notification: null,
  resultCd: 0,
  notificationReturn: null
};

export const reducer = createReducer(
  initialState,

  on(NotificationAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(NotificationAction.getNotification, (state, { payload }) => ({
    ...state,
  })),

  on(NotificationAction.getNotificationSuccess, (state, { response }) => ({
    ...state,
    notification: response.data,
  })),

  on(NotificationAction.getNotificationFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(NotificationAction.getNotificationSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(NotificationAction.editNotification, (state, { payload }) => ({
    ...state,
  })),

  on(NotificationAction.editNotificationSuccess, (state, { response }) => ({
    ...state,
    notificationReturn: response,
  })),

  on(NotificationAction.editNotificationFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(NotificationAction.editNotificationSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(NotificationAction.resetNotification, (state) => ({
    ...state,
    notification: null,
    notificationReturn: null
  }))
);
