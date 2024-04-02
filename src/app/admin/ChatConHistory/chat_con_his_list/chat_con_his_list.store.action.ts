import { Action, createAction, props, union } from '@ngrx/store';

export const storeKey = 'admin/guestMessageConHistoryList';

export const initial = createAction(`[${storeKey}] initial`);

export const getGuestMessageConHistoryList = createAction(
  `[${storeKey}] getGuestMessageConHistoryList`,
  props<{ payload: any }>()
);

export const getGuestMessageConHistoryListSuccess = createAction(
  `[${storeKey}] getGuestMessageConHistoryListSuccess`,
  props<{ response: any }>()
);

export const getGuestMessageConHistoryListFailed = createAction(
  `[${storeKey}] getGuestMessageConHistoryListFailed`,
  props<{ response: any }>()
);

export const getGuestMessageConHistoryListSystemFailed = createAction(
  `[${storeKey}] getGuestMessageConHistoryListSystemFailed`,
  props<{ error: any }>()
);


export const resetGuestMessageConHistoryList = createAction(
  `[${storeKey}] resetGuestMessageConHistorySystemFailed`
);

const actions = union({
  initial,

  getGuestMessageConHistoryList,
  getGuestMessageConHistoryListFailed,
  getGuestMessageConHistoryListSystemFailed,

  resetGuestMessageConHistoryList,
});

export type GuestMessageConHistoryListUnionActions = typeof actions;
