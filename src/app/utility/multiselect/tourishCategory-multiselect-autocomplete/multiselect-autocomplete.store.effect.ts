import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { MultiSelectTourishCategoryListStoreService } from "./multiselect-autocomplete.store.service";
import * as TourishCategoryListAction from "./multiselect-autocomplete.store.action";
import { TourishCategoryListUnionActions } from "./multiselect-autocomplete.store.action";

@Injectable()
export class TourishCategoryAutoCompleteListEffects {
  constructor(
    private action: Actions<TourishCategoryListAction.TourishCategoryListUnionActions>,
    private storeService: MultiSelectTourishCategoryListStoreService
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
  //getTourishCategoryListSuccess
}
