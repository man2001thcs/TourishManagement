import { createReducer, on } from '@ngrx/store';
import * as MovingContactAction from './moving_contact-detail.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  MovingContact: any;
  MovingContactReturn: any;
}

export const initialState: State = {
  MovingContact: null,
  resultCd: 0,
  MovingContactReturn: null
};

export const reducer = createReducer(
  initialState,

  on(MovingContactAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingContactAction.getMovingContact, (state, { payload }) => ({
    ...state,
  })),

  on(MovingContactAction.getMovingContactSuccess, (state, { response }) => ({
    ...state,
    MovingContact: response.data,
  })),

  on(MovingContactAction.getMovingContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactAction.getMovingContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingContactAction.editMovingContact, (state, { payload }) => ({
    ...state,
  })),

  on(MovingContactAction.editMovingContactSuccess, (state, { response }) => ({
    ...state,
    MovingContactReturn: response,
  })),

  on(MovingContactAction.editMovingContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactAction.editMovingContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })), 

  on(MovingContactAction.resetMovingContact, (state) => ({
    ...state,
    MovingContact: null,
    MovingContactReturn: null
  }))
);
