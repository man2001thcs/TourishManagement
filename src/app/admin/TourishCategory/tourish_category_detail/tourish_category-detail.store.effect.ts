import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TourishCategoryDetailStoreService } from './tourish_category-detail.store.service';
import * as TourishCategoryAction from './tourish_category-detail.store.action';
import { TourishCategoryUnionActions } from './tourish_category-detail.store.action';

@Injectable()
export class TourishCategoryEffects {
  constructor(
    private action: Actions<TourishCategoryAction.TourishCategoryUnionActions>,
    private storeService: TourishCategoryDetailStoreService
  ) {}

  getTourishCategory: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishCategoryAction.getTourishCategory),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getTourishCategory(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return TourishCategoryAction.getTourishCategorySuccess({
                response: response,
              });
            } else {
              return TourishCategoryAction.getTourishCategoryFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(TourishCategoryAction.getTourishCategorySystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getTourishCategorySuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.getTourishCategorySuccess)),
    { dispatch: false }
  );

  getTourishCategoryFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.getTourishCategoryFailed)),
    { dispatch: false }
  );

  getTourishCategorySystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.getTourishCategorySystemFailed)),
    { dispatch: false }
  );

  editTourishCategory: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishCategoryAction.editTourishCategory),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editTourishCategory(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishCategoryAction.editTourishCategorySuccess({
                response: response,
              });
            } else {
              return TourishCategoryAction.editTourishCategoryFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(TourishCategoryAction.editTourishCategorySystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editTourishCategorySuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.editTourishCategorySuccess)),
    { dispatch: false }
  );

  editTourishCategoryFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.editTourishCategoryFailed)),
    { dispatch: false }
  );

  editTourishCategorySystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.editTourishCategorySystemFailed)),
    { dispatch: false }
  );

  //editTourishCategorySuccess
}
