import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './moving_contact-list.store.action';
import { State } from './moving_contact-list.store.reducer';

export const MovingContactListFeatureState = createFeatureSelector<State>(storeKey);

export const getMovingContactList = createSelector(
  MovingContactListFeatureState,
  (state) => state.MovingContactList
);

export const getDeleteStatus = createSelector(
  MovingContactListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  MovingContactListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  MovingContactListFeatureState,
  (state) => state.error
);
