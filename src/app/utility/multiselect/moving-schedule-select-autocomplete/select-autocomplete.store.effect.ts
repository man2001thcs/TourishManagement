import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { MultiSelectMovingScheduleListStoreService } from "./select-autocomplete.store.service";
import * as MovingScheduleListAction from "./select-autocomplete.store.action";
import { MovingScheduleListUnionActions } from "./select-autocomplete.store.action";

@Injectable()
export class MovingScheduleAutoCompleteListEffects {
  constructor(
    private action: Actions<MovingScheduleListAction.MovingScheduleListUnionActions>,
    private storeService: MultiSelectMovingScheduleListStoreService
  ) {}

  getMovingScheduleList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingScheduleListAction.getMovingScheduleList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingScheduleList(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
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
  //getMovingScheduleListSuccess
}
