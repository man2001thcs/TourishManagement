import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { TourishPlanListStoreService } from "./tourishPlanList.store.service";
import * as TourishPlanListAction from "./tourishPlanList.store.action";
import { TourishPlanListUnionActions } from "./tourishPlanList.store.action";

@Injectable()
export class TourishPlanListEffects {
  constructor(
    private action: Actions<TourishPlanListAction.TourishPlanListUnionActions>,
    private storeService: TourishPlanListStoreService
  ) {}

  getTourishPlanList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishPlanListAction.getTourishPlanList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getTourishPlanList(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishPlanListAction.getTourishPlanListSuccess({
                response: response,
              });
            } else {
              return TourishPlanListAction.getTourishPlanListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              TourishPlanListAction.getTourishPlanListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getTourishPlanListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanListAction.getTourishPlanListSuccess)),
    { dispatch: false }
  );

  getTourishPlanListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanListAction.getTourishPlanListFailed)),
    { dispatch: false }
  );

  getTourishPlanListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(TourishPlanListAction.getTourishPlanListSystemFailed)),
    { dispatch: false }
  );

  deleteTourishPlan: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishPlanListAction.deleteTourishPlan),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteTourishPlan(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishPlanListAction.deleteTourishPlanSuccess({
                response: response,
              });
            } else {
              return TourishPlanListAction.deleteTourishPlanFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              TourishPlanListAction.deleteTourishPlanSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteTourishPlanListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanListAction.deleteTourishPlanSuccess)),
    { dispatch: false }
  );

  deleteTourishPlanListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanListAction.deleteTourishPlanFailed)),
    { dispatch: false }
  );

  deleteTourishPlanListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(TourishPlanListAction.deleteTourishPlanSystemFailed)),
    { dispatch: false }
  );

  //getTourishPlanListSuccess
}
