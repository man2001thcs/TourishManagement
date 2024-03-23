import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './multiselect-autocomplete.store.action';
import { State } from './multiselect-autocomplete.store.reducer';

export const userListFeatureState = createFeatureSelector<State>(storeKey);

export const getUserList = createSelector(
  userListFeatureState,
  (state) => state.userList
);

export const getDeleteStatus = createSelector(
  userListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  userListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  userListFeatureState,
  (state) => state.error
);
