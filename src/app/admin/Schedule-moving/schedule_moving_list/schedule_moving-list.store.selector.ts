import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './passenger_car-list.store.action';
import { State } from './passenger_car-list.store.reducer';

export const passengerCarListFeatureState = createFeatureSelector<State>(storeKey);

export const getPassengerCarList = createSelector(
  passengerCarListFeatureState,
  (state) => state.passengerCarList
);

export const getDeleteStatus = createSelector(
  passengerCarListFeatureState,
  (state) => state.deleteStatus
);

export const getMessage = createSelector(
  passengerCarListFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  passengerCarListFeatureState,
  (state) => state.error
);
