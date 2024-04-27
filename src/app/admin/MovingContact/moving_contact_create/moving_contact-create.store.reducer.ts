import { createReducer, on } from '@ngrx/store';
import * as MovingContactAction from './moving_contact-create.store.action';
import { IBaseState } from 'src/app/model/IBaseModel';

export interface State extends IBaseState {
  MovingContact: any;
  createStatus: any
}

export const initialState: State = {
  MovingContact: null,
  resultCd: 0,
  createStatus: null
};

export const reducer = createReducer(
  initialState,

  on(MovingContactAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(MovingContactAction.createMovingContact, (state, { payload }) => ({
    ...state,
  })),

  on(MovingContactAction.createMovingContactSuccess, (state, { response }) => ({
    ...state,
    createStatus: response,
  })),

  on(MovingContactAction.createMovingContactFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(MovingContactAction.createMovingContactSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(MovingContactAction.resetMovingContact, (state) => ({
    ...state,
    MovingContact: null,
    createStatus: null
  }))
);
