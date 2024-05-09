import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/StayingScheduleReceiptCreate';

export const initial = createAction(`[${storeKey}] initial`);

export const createReceipt = createAction(
  `[${storeKey}] createReceipt`,
  props<{ payload: any }>()
);

export const createReceiptSuccess = createAction(
  `[${storeKey}] createReceiptSuccess`,
  props<{ response: any }>()
);

export const createReceiptFailed = createAction(
  `[${storeKey}] createReceiptFailed`,
  props<{ response: any }>()
);

export const createReceiptSystemFailed = createAction(
  `[${storeKey}] createReceiptSystemFailed`,
  props<{ error: any }>()
);

export const resetReceipt = createAction(
  `[${storeKey}] resetReceiptSystemFailed`
);

const actions = union({
  initial,

  createReceipt,
  createReceiptFailed,
  createReceiptSystemFailed,

  resetReceipt,
});

export type ReceiptUnionActions = typeof actions;
