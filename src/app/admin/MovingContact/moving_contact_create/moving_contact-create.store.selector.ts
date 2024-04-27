import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './moving_contact-create.store.action';
import { State } from './moving_contact-create.store.reducer';

export const MovingContactFeatureState = createFeatureSelector<State>(storeKey);

export const createMovingContact = createSelector(
  MovingContactFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  MovingContactFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  MovingContactFeatureState,
  (state) => state.error
);
