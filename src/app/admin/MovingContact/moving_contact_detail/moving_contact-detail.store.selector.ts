import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './moving_contact-detail.store.action';
import { State } from './moving_contact-detail.store.reducer';

export const MovingContactFeatureState = createFeatureSelector<State>(storeKey);

export const getMovingContact = createSelector(
  MovingContactFeatureState,
  (state) => state.MovingContact
);

export const editMovingContact = createSelector(
  MovingContactFeatureState,
  (state) => state.MovingContactReturn
);

export const getMessage = createSelector(
  MovingContactFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  MovingContactFeatureState,
  (state) => state.error
);
