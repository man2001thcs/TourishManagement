import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TourishCategoryCreateStoreService } from './tourish_category-create.store.service';
import * as TourishCategoryAction from './tourish_category-create.store.action';
import { TourishCategoryUnionActions } from './tourish_category-create.store.action';

@Injectable()
export class TourishCategoryCreateEffects {
  constructor(
    private action: Actions<TourishCategoryAction.TourishCategoryUnionActions>,
    private storeService: TourishCategoryCreateStoreService
  ) {}

  createTourishCategory: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishCategoryAction.createTourishCategory),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createTourishCategory(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return TourishCategoryAction.createTourishCategorySuccess({
                response: response,
              });
            } else {
              return TourishCategoryAction.createTourishCategoryFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(TourishCategoryAction.createTourishCategorySystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createTourishCategorySuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.createTourishCategorySuccess)),
    { dispatch: false }
  );

  createTourishCategoryFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.createTourishCategoryFailed)),
    { dispatch: false }
  );

  createTourishCategorySystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishCategoryAction.createTourishCategorySystemFailed)),
    { dispatch: false }
  );

  //createTourishCategorySuccess
}
