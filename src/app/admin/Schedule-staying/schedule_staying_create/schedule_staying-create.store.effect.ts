import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { StayingScheduleStoreService } from './schedule_staying-create.store.service';
import * as StayingScheduleAction from './schedule_staying-create.store.action';
import { StayingScheduleUnionActions } from './schedule_staying-create.store.action';

@Injectable()
export class StayingScheduleCreateEffects {
  constructor(
    private action: Actions<StayingScheduleAction.StayingScheduleUnionActions>,
    private storeService: StayingScheduleStoreService
  ) {}

  createStayingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleAction.createStayingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createStayingSchedule(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return StayingScheduleAction.createStayingScheduleSuccess({
                response: response,
              });
            } else {
              return StayingScheduleAction.createStayingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(StayingScheduleAction.createStayingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createStayingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.createStayingScheduleSuccess)),
    { dispatch: false }
  );

  createStayingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.createStayingScheduleFailed)),
    { dispatch: false }
  );

  createStayingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleAction.createStayingScheduleSystemFailed)),
    { dispatch: false }
  );

  //createStayingScheduleSuccess
}
