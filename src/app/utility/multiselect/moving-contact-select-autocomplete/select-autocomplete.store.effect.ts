import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { SelectMovingContactListStoreService } from "./select-autocomplete.store.service";
import * as MovingContactListAction from "./select-autocomplete.store.action";
import { MovingContactListUnionActions } from "./select-autocomplete.store.action";

@Injectable()
export class MovingContactAutoCompleteListEffects {
  constructor(
    private action: Actions<MovingContactListAction.MovingContactListUnionActions>,
    private storeService: SelectMovingContactListStoreService
  ) {}

  getMovingContactList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactListAction.getMovingContactList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingContactList(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return MovingContactListAction.getMovingContactListSuccess({
                response: response,
              });
            } else {
              return MovingContactListAction.getMovingContactListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              MovingContactListAction.getMovingContactListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getMovingContactListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactListAction.getMovingContactListSuccess)),
    { dispatch: false }
  );

  getMovingContactListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactListAction.getMovingContactListFailed)),
    { dispatch: false }
  );

  getMovingContactListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(MovingContactListAction.getMovingContactListSystemFailed)),
    { dispatch: false }
  );
  //getMovingContactListSuccess
}
