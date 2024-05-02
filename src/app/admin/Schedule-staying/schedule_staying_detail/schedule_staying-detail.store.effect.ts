import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { StayingScheduleStoreService } from './schedule_staying-detail.store.service';
import * as StayingScheduleAction from './schedule_staying-detail.store.action';

@Injectable()
export class StayingScheduleEffects {
  constructor(
    private action: Actions<StayingScheduleAction.StayingScheduleUnionActions>,
    private storeService: StayingScheduleStoreService
  ) {}

  getStayingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleAction.getStayingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getStayingSchedule(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return StayingScheduleAction.getStayingScheduleSuccess({
                response: response,
              });
            } else {
              return StayingScheduleAction.getStayingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(StayingScheduleAction.getStayingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getStayingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.getStayingScheduleSuccess)),
    { dispatch: false }
  );

  getStayingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.getStayingScheduleFailed)),
    { dispatch: false }
  );

  getStayingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.getStayingScheduleSystemFailed)),
    { dispatch: false }
  );

  editStayingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleAction.editStayingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editStayingSchedule(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return StayingScheduleAction.editStayingScheduleSuccess({
                response: response,
              });
            } else {
              return StayingScheduleAction.editStayingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(StayingScheduleAction.editStayingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editStayingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.editStayingScheduleSuccess)),
    { dispatch: false }
  );

  editStayingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.editStayingScheduleFailed)),
    { dispatch: false }
  );

  editStayingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.editStayingScheduleSystemFailed)),
    { dispatch: false }
  );

  //editStayingScheduleSuccess
}
