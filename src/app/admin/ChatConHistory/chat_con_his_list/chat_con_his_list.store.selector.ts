import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './chat_con_his_list.store.action';
import { State } from './chat_con_his_list.store.reducer';

export const guestMessageConHistoryListFeatureState = createFeatureSelector<State>(storeKey);

export const getGuestMessageConHistoryList = createSelector(
  guestMessageConHistoryListFeatureState,
  (state) => state.guestMessageConHistoryList
);

export const getDeleteStatus = createSelector(
  guestMessageConHistoryListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  guestMessageConHistoryListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  guestMessageConHistoryListFeatureState,
  (state) => state.error
);
