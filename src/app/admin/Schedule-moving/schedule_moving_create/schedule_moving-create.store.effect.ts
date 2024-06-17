import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovingScheduleStoreService } from './schedule_moving-create.store.service';
import * as MovingScheduleAction from './schedule_moving-create.store.action';
import { MovingScheduleUnionActions } from './schedule_moving-create.store.action';

@Injectable()
export class MovingScheduleCreateEffects {
  constructor(
    private action: Actions<MovingScheduleAction.MovingScheduleUnionActions>,
    private storeService: MovingScheduleStoreService
  ) {}

  createMovingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleAction.createMovingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createMovingSchedule(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return MovingScheduleAction.createMovingScheduleSuccess({
                response: response,
              });
            } else {
              return MovingScheduleAction.createMovingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingScheduleAction.createMovingScheduleSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createMovingScheduleSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.createMovingScheduleSuccess)),
    { dispatch: false }
  );

  createMovingScheduleFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.createMovingScheduleFailed)),
    { dispatch: false }
  );

  createMovingScheduleSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleAction.createMovingScheduleSystemFailed)),
    { dispatch: false }
  );

  //createMovingScheduleSuccess
}
