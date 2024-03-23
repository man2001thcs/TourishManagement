import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './notification-create.store.action';
import { State } from './notification-create.store.reducer';

export const NotificationFeatureState = createFeatureSelector<State>(storeKey);

export const createNotification = createSelector(
  NotificationFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  NotificationFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  NotificationFeatureState,
  (state) => state.error
);
