import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovingScheduleStoreService } from './schedule_moving-detail.store.service';
import * as MovingScheduleAction from './schedule_moving-detail.store.action';
import { MovingScheduleUnionActions } from './schedule_moving-detail.store.action';

@Injectable()
export class MovingScheduleEffects {
  constructor(
    private action: Actions<MovingScheduleAction.MovingScheduleUnionActions>,
    private storeService: MovingScheduleStoreService
  ) {}

  getMovingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleAction.getMovingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingSchedule(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return MovingScheduleAction.getMovingScheduleSuccess({
                response: response,
              });
            } else {
              return MovingScheduleAction.getMovingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingScheduleAction.getMovingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getMovingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.getMovingScheduleSuccess)),
    { dispatch: false }
  );

  getMovingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.getMovingScheduleFailed)),
    { dispatch: false }
  );

  getMovingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.getMovingScheduleSystemFailed)),
    { dispatch: false }
  );

  editMovingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleAction.editMovingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editMovingSchedule(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return MovingScheduleAction.editMovingScheduleSuccess({
                response: response,
              });
            } else {
              return MovingScheduleAction.editMovingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingScheduleAction.editMovingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editMovingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.editMovingScheduleSuccess)),
    { dispatch: false }
  );

  editMovingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.editMovingScheduleFailed)),
    { dispatch: false }
  );

  editMovingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.editMovingScheduleSystemFailed)),
    { dispatch: false }
  );

  //editMovingScheduleSuccess
}
