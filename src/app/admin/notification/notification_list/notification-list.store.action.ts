import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/notificationList';

export const initial = createAction(`[${storeKey}] initial`);

export const getNotificationList = createAction(
  `[${storeKey}] getNotificationList`,
  props<{ payload: any }>()
);

export const getNotificationListSuccess = createAction(
  `[${storeKey}] getNotificationListSuccess`,
  props<{ response: any }>()
);

export const getNotificationListFailed = createAction(
  `[${storeKey}] getNotificationListFailed`,
  props<{ response: any }>()
);

export const getNotificationListSystemFailed = createAction(
  `[${storeKey}] getNotificationListSystemFailed`,
  props<{ error: any }>()
);

export const deleteNotification = createAction(
  `[${storeKey}] deleteNotification`,
  props<{ payload: any }>()
);

export const deleteNotificationSuccess = createAction(
  `[${storeKey}] deleteNotificationSuccess`,
  props<{ response: any }>()
);

export const deleteNotificationFailed = createAction(
  `[${storeKey}] deleteNotificationFailed`,
  props<{ response: any }>()
);

export const deleteNotificationSystemFailed = createAction(
  `[${storeKey}] deleteNotificationSystemFailed`,
  props<{ error: any }>()
);


export const resetNotificationList = createAction(
  `[${storeKey}] resetNotificationSystemFailed`
);

const actions = union({
  initial,

  getNotificationList,
  getNotificationListFailed,
  getNotificationListSystemFailed,

  deleteNotification,
  deleteNotificationFailed,
  deleteNotificationSystemFailed,

  resetNotificationList,
});

export type NotificationListUnionActions = typeof actions;
