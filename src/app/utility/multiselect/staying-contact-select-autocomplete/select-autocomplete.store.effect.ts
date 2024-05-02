import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { SelectRestHouseContactListStoreService } from "./select-autocomplete.store.service";
import * as RestHouseContactListAction from "./select-autocomplete.store.action";
import { RestHouseContactListUnionActions } from "./select-autocomplete.store.action";

@Injectable()
export class RestHouseContactAutoCompleteListEffects {
  constructor(
    private action: Actions<RestHouseContactListAction.RestHouseContactListUnionActions>,
    private storeService: SelectRestHouseContactListStoreService
  ) {}

  getRestHouseContactList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestHouseContactListAction.getRestHouseContactList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getRestHouseContactList(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return RestHouseContactListAction.getRestHouseContactListSuccess({
                response: response,
              });
            } else {
              return RestHouseContactListAction.getRestHouseContactListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              RestHouseContactListAction.getRestHouseContactListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getRestHouseContactListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactListAction.getRestHouseContactListSuccess)),
    { dispatch: false }
  );

  getRestHouseContactListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactListAction.getRestHouseContactListFailed)),
    { dispatch: false }
  );

  getRestHouseContactListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(RestHouseContactListAction.getRestHouseContactListSystemFailed)),
    { dispatch: false }
  );
  //getRestHouseContactListSuccess
}
