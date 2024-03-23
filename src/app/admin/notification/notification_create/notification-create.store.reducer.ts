import { createReducer, on } from '@ngrx/store';
import * as NotificationAction from './notification-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  Notification: any;
  createStatus: any
}

export const initialState: State = {
  Notification: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(NotificationAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(NotificationAction.createNotification, (state, { payload }) => ({
    ...state,
  })),

  on(NotificationAction.createNotificationSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(NotificationAction.createNotificationFailed, (state, { response }) => ({
    ...state,
    messageCode: response.messageCode,
  })),

  on(NotificationAction.createNotificationSystemFailed, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(NotificationAction.resetNotification, (state) => ({
    ...state,
    Notification: null,
    createStatus: null
  }))
);
