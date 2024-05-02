import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { MovingScheduleListStoreService } from "./schedule_staying-list.store.service";
import * as MovingScheduleListAction from "./schedule_staying-list.store.action";
import { MovingScheduleListUnionActions } from "./schedule_staying-list.store.action";

@Injectable()
export class MovingScheduleListEffects {
  constructor(
    private action: Actions<MovingScheduleListAction.MovingScheduleListUnionActions>,
    private storeService: MovingScheduleListStoreService
  ) {}

  getMovingScheduleList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleListAction.getMovingScheduleList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingScheduleList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return MovingScheduleListAction.getMovingScheduleListSuccess({
                response: response,
              });
            } else {
              return MovingScheduleListAction.getMovingScheduleListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              MovingScheduleListAction.getMovingScheduleListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getMovingScheduleListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleListAction.getMovingScheduleListSuccess)),
    { dispatch: false }
  );

  getMovingScheduleListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleListAction.getMovingScheduleListFailed)),
    { dispatch: false }
  );

  getMovingScheduleListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(MovingScheduleListAction.getMovingScheduleListSystemFailed)),
    { dispatch: false }
  );

  deleteMovingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleListAction.deleteMovingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteMovingSchedule(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return MovingScheduleListAction.deleteMovingScheduleSuccess({
                response: response,
              });
            } else {
              return MovingScheduleListAction.deleteMovingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              MovingScheduleListAction.deleteMovingScheduleSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteMovingScheduleListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleListAction.deleteMovingScheduleSuccess)),
    { dispatch: false }
  );

  deleteMovingScheduleListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingScheduleListAction.deleteMovingScheduleFailed)),
    { dispatch: false }
  );

  deleteMovingScheduleListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(MovingScheduleListAction.deleteMovingScheduleSystemFailed)),
    { dispatch: false }
  );

  //getMovingScheduleListSuccess
}
