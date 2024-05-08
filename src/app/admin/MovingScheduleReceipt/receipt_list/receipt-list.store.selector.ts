import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './receipt-list.store.action';
import { State } from './receipt-list.store.reducer';

export const hotelListFeatureState = createFeatureSelector<State>(storeKey);

export const getReceiptList = createSelector(
  hotelListFeatureState,
  (state) => state.hotelList
);

export const getDeleteStatus = createSelector(
  hotelListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  hotelListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  hotelListFeatureState,
  (state) => state.error
);
