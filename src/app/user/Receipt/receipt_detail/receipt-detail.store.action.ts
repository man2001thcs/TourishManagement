import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'user/receiptUserInfo';

export const initial = createAction(`[${storeKey}] initial`);

export const getReceipt = createAction(
  `[${storeKey}] getReceipt`,
  props<{ payload: any }>()
);

export const getReceiptSuccess = createAction(
  `[${storeKey}] getReceiptSuccess`,
  props<{ response: any }>()
);

export const getReceiptFailed = createAction(
  `[${storeKey}] getReceiptFailed`,
  props<{ response: any }>()
);

export const getReceiptSystemFailed = createAction(
  `[${storeKey}] getReceiptSystemFailed`,
  props<{ error: any }>()
);

export const editReceipt = createAction(
  `[${storeKey}] editReceipt`,
  props<{ payload: any }>()
);

export const editReceiptSuccess = createAction(
  `[${storeKey}] editReceiptSuccess`,
  props<{ response: any }>()
);

export const editReceiptFailed = createAction(
  `[${storeKey}] editReceiptFailed`,
  props<{ response: any }>()
);

export const editReceiptSystemFailed = createAction(
  `[${storeKey}] editReceiptSystemFailed`,
  props<{ error: any }>()
);

export const resetReceipt = createAction(
  `[${storeKey}] resetReceiptFailed`
);

const actions = union({
  initial,
  
  getReceipt,
  getReceiptFailed,
  getReceiptSystemFailed,

  editReceipt,
  editReceiptFailed,
  editReceiptSystemFailed,

  resetReceipt,
});

export type ReceiptUnionActions = typeof actions;
