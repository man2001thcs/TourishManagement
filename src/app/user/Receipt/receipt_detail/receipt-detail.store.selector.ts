import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './receipt-detail.store.action';
import { State } from './receipt-detail.store.reducer';

export const hotelFeatureState = createFeatureSelector<State>(storeKey);

export const getReceipt = createSelector(
  hotelFeatureState,
  (state) => state.hotel
);

export const editReceipt = createSelector(
  hotelFeatureState,
  (state) => state.hotelReturn
);

export const getMessage = createSelector(
  hotelFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  hotelFeatureState,
  (state) => state.error
);
