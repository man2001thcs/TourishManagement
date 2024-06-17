import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { ImageListStoreService } from "./imageUpload.store.service";
import * as ImageListAction from "./imageUpload.store.action";
import { ImageListUnionActions } from "./imageUpload.store.action";

@Injectable()
export class ImageListEffects {
  constructor(
    private action: Actions<ImageListAction.ImageListUnionActions>,
    private storeService: ImageListStoreService
  ) {}

  getImageList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ImageListAction.getImageList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getImageList(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return ImageListAction.getImageListSuccess({
                response: response,
              });
            } else {
              return ImageListAction.getImageListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              ImageListAction.getImageListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getImageListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ImageListAction.getImageListSuccess)),
    { dispatch: false }
  );

  getImageListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ImageListAction.getImageListFailed)),
    { dispatch: false }
  );

  getImageListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(ImageListAction.getImageListSystemFailed)),
    { dispatch: false }
  );

  deleteImage: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ImageListAction.deleteImage),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteImage(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return ImageListAction.deleteImageSuccess({
                response: response,
              });
            } else {
              return ImageListAction.deleteImageFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              ImageListAction.deleteImageSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteImageListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ImageListAction.deleteImageSuccess)),
    { dispatch: false }
  );

  deleteImageListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ImageListAction.deleteImageFailed)),
    { dispatch: false }
  );

  deleteImageListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(ImageListAction.deleteImageSystemFailed)),
    { dispatch: false }
  );

  //getImageListSuccess
}
