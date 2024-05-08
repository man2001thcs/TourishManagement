import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { SelectStayingScheduleListStoreService } from "./select-autocomplete.store.service";
import * as StayingScheduleListAction from "./select-autocomplete.store.action";
import { StayingScheduleListUnionActions } from "./select-autocomplete.store.action";

@Injectable()
export class StayingScheduleAutoCompleteListEffects {
  constructor(
    private action: Actions<StayingScheduleListAction.StayingScheduleListUnionActions>,
    private storeService: SelectStayingScheduleListStoreService
  ) {}

  getStayingScheduleList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(StayingScheduleListAction.getStayingScheduleList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getStayingScheduleList(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
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
  //getStayingScheduleListSuccess
}
