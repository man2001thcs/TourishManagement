import { createFeatureSelector, createSelector } from '@ngrx/store';
import { storeKey } from './passenger_car-detail.store.action';
import { State } from './passenger_car-detail.store.reducer';

export const passengerCarFeatureState = createFeatureSelector<State>(storeKey);

export const getPassengerCar = createSelector(
  passengerCarFeatureState,
  (state) => state.passengerCar
);

export const editPassengerCar = createSelector(
  passengerCarFeatureState,
  (state) => state.passengerCarReturn
);

export const getMessage = createSelector(
  passengerCarFeatureState,
  (state) => state.messageCode
);

export const getSysError = createSelector(
  passengerCarFeatureState,
  (state) => state.error
);
