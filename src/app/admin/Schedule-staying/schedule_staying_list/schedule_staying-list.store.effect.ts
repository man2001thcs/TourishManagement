import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { StayingScheduleListStoreService } from "./schedule_staying-list.store.service";
import * as StayingScheduleListAction from "./schedule_staying-list.store.action";
import { StayingScheduleListUnionActions } from "./schedule_staying-list.store.action";

@Injectable()
export class StayingScheduleListEffects {
  constructor(
    private action: Actions<StayingScheduleListAction.StayingScheduleListUnionActions>,
    private storeService: StayingScheduleListStoreService
  ) {}

  getStayingScheduleList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleListAction.getStayingScheduleList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getStayingScheduleList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return StayingScheduleListAction.getStayingScheduleListSuccess({
                response: response,
              });
            } else {
              return StayingScheduleListAction.getStayingScheduleListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              StayingScheduleListAction.getStayingScheduleListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getStayingScheduleListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleListAction.getStayingScheduleListSuccess)),
    { dispatch: false }
  );

  getStayingScheduleListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleListAction.getStayingScheduleListFailed)),
    { dispatch: false }
  );

  getStayingScheduleListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(StayingScheduleListAction.getStayingScheduleListSystemFailed)),
    { dispatch: false }
  );

  deleteStayingSchedule: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleListAction.deleteStayingSchedule),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteStayingSchedule(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return StayingScheduleListAction.deleteStayingScheduleSuccess({
                response: response,
              });
            } else {
              return StayingScheduleListAction.deleteStayingScheduleFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              StayingScheduleListAction.deleteStayingScheduleSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteStayingScheduleListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleListAction.deleteStayingScheduleSuccess)),
    { dispatch: false }
  );

  deleteStayingScheduleListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(StayingScheduleListAction.deleteStayingScheduleFailed)),
    { dispatch: false }
  );

  deleteStayingScheduleListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(StayingScheduleListAction.deleteStayingScheduleSystemFailed)),
    { dispatch: false }
  );

  //getStayingScheduleListSuccess
}
