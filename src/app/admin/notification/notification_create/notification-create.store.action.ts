import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/NotificationCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createNotification = createAction(
  `[${storeKey}] createNotification`,
  props<{ payload: any }>()
);

export const createNotificationSuccess = createAction(
  `[${storeKey}] createNotificationSuccess`,
  props<{ response: any }>()
);

export const createNotificationFailed = createAction(
  `[${storeKey}] createNotificationFailed`,
  props<{ response: any }>()
);

export const createNotificationSystemFailed = createAction(
  `[${storeKey}] createNotificationSystemFailed`,
  props<{ error: any }>()
);

export const resetNotification = createAction(
  `[${storeKey}] resetNotificationSystemFailed`
);

const actions = union({
  initial,

  createNotification,
  createNotificationFailed,
  createNotificationSystemFailed,

  resetNotification,
});

export type NotificationUnionActions = typeof actions;
