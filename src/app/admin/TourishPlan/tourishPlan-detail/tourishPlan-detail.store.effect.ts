import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TourishPlanStoreService } from './tourishPlan-detail.store.service';
import * as TourishPlanAction from './tourishPlan-detail.store.action';
import { TourishPlanUnionActions } from './tourishPlan-detail.store.action';

@Injectable()
export class TourishPlanDetailEffects {
  constructor(
    private action: Actions<TourishPlanAction.TourishPlanUnionActions>,
    private storeService: TourishPlanStoreService
  ) {}

  getTourishPlan: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishPlanAction.getTourishPlan),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getTourishPlan(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return TourishPlanAction.getTourishPlanSuccess({
                response: response,
              });
            } else {
              return TourishPlanAction.getTourishPlanFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(TourishPlanAction.getTourishPlanSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getTourishPlanSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.getTourishPlanSuccess)),
    { dispatch: false }
  );

  getTourishPlanFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.getTourishPlanFailed)),
    { dispatch: false }
  );

  getTourishPlanSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.getTourishPlanSystemFailed)),
    { dispatch: false }
  );

  editTourishPlan: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(TourishPlanAction.editTourishPlan),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editTourishPlan(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return TourishPlanAction.editTourishPlanSuccess({
                response: response,
              });
            } else {
              return TourishPlanAction.editTourishPlanFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(TourishPlanAction.editTourishPlanSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editTourishPlanSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.editTourishPlanSuccess)),
    { dispatch: false }
  );

  editTourishPlanFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.editTourishPlanFailed)),
    { dispatch: false }
  );

  editTourishPlanSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(TourishPlanAction.editTourishPlanSystemFailed)),
    { dispatch: false }
  );

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  //editTourishPlanSuccess
}
