import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import * as TourishCategoryListAction from "./tourish_category-list.store.action";
import { TourishCategoryListUnionActions } from "./tourish_category-list.store.action";
import { TourishCategoryListStoreService } from "./tourish_category-list.store.service";

@Injectable()
export class TourishCategoryListEffects {
  constructor(
    private action: Actions<TourishCategoryListAction.TourishCategoryListUnionActions>,
    private storeService: TourishCategoryListStoreService
  ) {}

  getTourishCategoryList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishCategoryListAction.getTourishCategoryList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getTourishCategoryList(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishCategoryListAction.getTourishCategoryListSuccess({
                response: response,
              });
            } else {
              return TourishCategoryListAction.getTourishCategoryListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              TourishCategoryListAction.getTourishCategoryListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getTourishCategoryListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryListAction.getTourishCategoryListSuccess)),
    { dispatch: false }
  );

  getTourishCategoryListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryListAction.getTourishCategoryListFailed)),
    { dispatch: false }
  );

  getTourishCategoryListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(TourishCategoryListAction.getTourishCategoryListSystemFailed)),
    { dispatch: false }
  );

  deleteTourishCategory: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishCategoryListAction.deleteTourishCategory),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteTourishCategory(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishCategoryListAction.deleteTourishCategorySuccess({
                response: response,
              });
            } else {
              return TourishCategoryListAction.deleteTourishCategoryFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              TourishCategoryListAction.deleteTourishCategorySystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteTourishCategoryListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryListAction.deleteTourishCategorySuccess)),
    { dispatch: false }
  );

  deleteTourishCategoryListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryListAction.deleteTourishCategoryFailed)),
    { dispatch: false }
  );

  deleteTourishCategoryListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(TourishCategoryListAction.deleteTourishCategorySystemFailed)),
    { dispatch: false }
  );

  //getTourishCategoryListSuccess
}
