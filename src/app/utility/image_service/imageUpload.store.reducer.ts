import { createReducer, on } from "@ngrx/store";
import * as ImageListAction from "./imageUpload.store.action";
import { IBaseState } from "src/app/model/IBaseModel";

export interface State extends IBaseState {
  imageList: any;
  pageNumber: number;
  pageOffset: number;
  deleteStatus: any;
}

export const initialState: State = {
  pageNumber: 0,
  pageOffset: 0,
  imageList: [],
  deleteStatus: null,
  resultCd: 0,
};

export const reducer = createReducer(
  initialState,

  on(ImageListAction.initial, (state) => ({
    ...state,
    initialState,
  })),

  on(ImageListAction.getImageList, (state, { payload }) => ({
    ...state,
  })),

  on(ImageListAction.getImageListSuccess, (state, { response }) => ({
    ...state,
    imageList: response,
  })),

  on(ImageListAction.getImageListFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ImageListAction.getImageListSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ImageListAction.deleteImage, (state, { payload }) => ({
    ...state,
  })),

  on(ImageListAction.deleteImageSuccess, (state, { response }) => ({
    ...state,
    deleteStatus: response,
  })),

  on(ImageListAction.deleteImageFailed, (state, { response }) => ({
    ...state,
    messageCode: {code: response.messageCode},
  })),

  on(ImageListAction.deleteImageSystemFailed, (state, { error }) => ({
    ...state,
    error: {message: error},
  })),

  on(ImageListAction.resetImageList, (state) => ({
    ...state,
    pageNumber: 0,
    pageOffset: 0,
    imageList: [],
    deleteStatus: null,
  }))
);
