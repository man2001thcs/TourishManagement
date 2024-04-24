import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/passengerCarInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getPassengerCar = createAction(
  `[${storeKey}] getPassengerCar`,
  props<{ payload: any }>()
);

export const getPassengerCarSuccess = createAction(
  `[${storeKey}] getPassengerCarSuccess`,
  props<{ response: any }>()
);

export const getPassengerCarFailed = createAction(
  `[${storeKey}] getPassengerCarFailed`,
  props<{ response: any }>()
);

export const getPassengerCarSystemFailed = createAction(
  `[${storeKey}] getPassengerCarSystemFailed`,
  props<{ error: any }>()
);

export const editPassengerCar = createAction(
  `[${storeKey}] editPassengerCar`,
  props<{ payload: any }>()
);

export const editPassengerCarSuccess = createAction(
  `[${storeKey}] editPassengerCarSuccess`,
  props<{ response: any }>()
);

export const editPassengerCarFailed = createAction(
  `[${storeKey}] editPassengerCarFailed`,
  props<{ response: any }>()
);

export const editPassengerCarSystemFailed = createAction(
  `[${storeKey}] editPassengerCarSystemFailed`,
  props<{ error: any }>()
);

export const resetPassengerCar = createAction(
  `[${storeKey}] resetPassengerCarFailed`
);

const actions = union({
  initial,
  
  getPassengerCar,
  getPassengerCarFailed,
  getPassengerCarSystemFailed,

  editPassengerCar,
  editPassengerCarFailed,
  editPassengerCarSystemFailed,

  resetPassengerCar,
});

export type PassengerCarUnionActions = typeof actions;
