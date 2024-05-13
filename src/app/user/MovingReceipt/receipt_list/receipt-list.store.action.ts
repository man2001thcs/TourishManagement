import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'user/movingReceiptUserList';

export const initial = createAction(`[${storeKey}] initial`);

export const getReceiptList = createAction(
  `[${storeKey}] getReceiptList`,
  props<{ payload: any }>()
);

export const getReceiptListSuccess = createAction(
  `[${storeKey}] getReceiptListSuccess`,
  props<{ response: any }>()
);

export const getReceiptListFailed = createAction(
  `[${storeKey}] getReceiptListFailed`,
  props<{ response: any }>()
);

export const getReceiptListSystemFailed = createAction(
  `[${storeKey}] getReceiptListSystemFailed`,
  props<{ error: any }>()
);

export const deleteReceipt = createAction(
  `[${storeKey}] deleteReceipt`,
  props<{ payload: any }>()
);

export const deleteReceiptSuccess = createAction(
  `[${storeKey}] deleteReceiptSuccess`,
  props<{ response: any }>()
);

export const deleteReceiptFailed = createAction(
  `[${storeKey}] deleteReceiptFailed`,
  props<{ response: any }>()
);

export const deleteReceiptSystemFailed = createAction(
  `[${storeKey}] deleteReceiptSystemFailed`,
  props<{ error: any }>()
);


export const resetReceiptList = createAction(
  `[${storeKey}] resetReceiptSystemFailed`
);

const actions = union({
  initial,

  getReceiptList,
  getReceiptListFailed,
  getReceiptListSystemFailed,

  deleteReceipt,
  deleteReceiptFailed,
  deleteReceiptSystemFailed,

  resetReceiptList,
});

export type ReceiptListUnionActions = typeof actions;
