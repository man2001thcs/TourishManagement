import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/notificationInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getNotification = createAction(
  `[${storeKey}] getNotification`,
  props<{ payload: any }>()
);

export const getNotificationSuccess = createAction(
  `[${storeKey}] getNotificationSuccess`,
  props<{ response: any }>()
);

export const getNotificationFailed = createAction(
  `[${storeKey}] getNotificationFailed`,
  props<{ response: any }>()
);

export const getNotificationSystemFailed = createAction(
  `[${storeKey}] getNotificationSystemFailed`,
  props<{ error: any }>()
);

export const editNotification = createAction(
  `[${storeKey}] editNotification`,
  props<{ payload: any }>()
);

export const editNotificationSuccess = createAction(
  `[${storeKey}] editNotificationSuccess`,
  props<{ response: any }>()
);

export const editNotificationFailed = createAction(
  `[${storeKey}] editNotificationFailed`,
  props<{ response: any }>()
);

export const editNotificationSystemFailed = createAction(
  `[${storeKey}] editNotificationSystemFailed`,
  props<{ error: any }>()
);

export const resetNotification = createAction(
  `[${storeKey}] resetNotificationFailed`
);

const actions = union({
  initial,
  
  getNotification,
  getNotificationFailed,
  getNotificationSystemFailed,

  editNotification,
  editNotificationFailed,
  editNotificationSystemFailed,

  resetNotification,
});

export type NotificationUnionActions = typeof actions;
