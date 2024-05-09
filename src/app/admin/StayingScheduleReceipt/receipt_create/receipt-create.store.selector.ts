import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './receipt-create.store.action';
import { State } from './receipt-create.store.reducer';

export const ReceiptFeatureState = createFeatureSelector<State>(storeKey);

export const createReceipt = createSelector(
  ReceiptFeatureState,
  (state) => state.createStatus
);

export const getMessage = createSelector(
  ReceiptFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  ReceiptFeatureState,
  (state) => state.error
);
