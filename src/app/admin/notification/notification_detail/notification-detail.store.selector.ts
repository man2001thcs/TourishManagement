import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './notification-detail.store.action';
import { State } from './notification-detail.store.reducer';

export const notificationFeatureState = createFeatureSelector<State>(storeKey);

export const getNotification = createSelector(
  notificationFeatureState,
  (state) => state.notification
);

export const editNotification = createSelector(
  notificationFeatureState,
  (state) => state.notificationReturn
);

export const getMessage = createSelector(
  notificationFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  notificationFeatureState,
  (state) => state.error
);
