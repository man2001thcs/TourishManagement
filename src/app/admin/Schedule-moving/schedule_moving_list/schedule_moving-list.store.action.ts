import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/passengerCarList';

export const initial = createAction(`[${storeKey}] initial`);

export const getPassengerCarList = createAction(
  `[${storeKey}] getPassengerCarList`,
  props<{ payload: any }>()
);

export const getPassengerCarListSuccess = createAction(
  `[${storeKey}] getPassengerCarListSuccess`,
  props<{ response: any }>()
);

export const getPassengerCarListFailed = createAction(
  `[${storeKey}] getPassengerCarListFailed`,
  props<{ response: any }>()
);

export const getPassengerCarListSystemFailed = createAction(
  `[${storeKey}] getPassengerCarListSystemFailed`,
  props<{ error: any }>()
);

export const deletePassengerCar = createAction(
  `[${storeKey}] deletePassengerCar`,
  props<{ payload: any }>()
);

export const deletePassengerCarSuccess = createAction(
  `[${storeKey}] deletePassengerCarSuccess`,
  props<{ response: any }>()
);

export const deletePassengerCarFailed = createAction(
  `[${storeKey}] deletePassengerCarFailed`,
  props<{ response: any }>()
);

export const deletePassengerCarSystemFailed = createAction(
  `[${storeKey}] deletePassengerCarSystemFailed`,
  props<{ error: any }>()
);


export const resetPassengerCarList = createAction(
  `[${storeKey}] resetPassengerCarSystemFailed`
);

const actions = union({
  initial,

  getPassengerCarList,
  getPassengerCarListFailed,
  getPassengerCarListSystemFailed,

  deletePassengerCar,
  deletePassengerCarFailed,
  deletePassengerCarSystemFailed,

  resetPassengerCarList,
});

export type PassengerCarListUnionActions = typeof actions;
