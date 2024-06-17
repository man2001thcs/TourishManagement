import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { RestHouseContactListStoreService } from "./rest-house-contact-list.store.service";
import * as RestHouseContactListAction from "./rest-house-contact-list.store.action";
import { RestHouseContactListUnionActions } from "./rest-house-contact-list.store.action";

@Injectable()
export class RestHouseContactListEffects {
  constructor(
    private action: Actions<RestHouseContactListAction.RestHouseContactListUnionActions>,
    private storeService: RestHouseContactListStoreService
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

  deleteRestHouseContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestHouseContactListAction.deleteRestHouseContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteRestHouseContact(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return RestHouseContactListAction.deleteRestHouseContactSuccess({
                response: response,
              });
            } else {
              return RestHouseContactListAction.deleteRestHouseContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              RestHouseContactListAction.deleteRestHouseContactSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteRestHouseContactListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactListAction.deleteRestHouseContactSuccess)),
    { dispatch: false }
  );

  deleteRestHouseContactListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactListAction.deleteRestHouseContactFailed)),
    { dispatch: false }
  );

  deleteRestHouseContactListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(RestHouseContactListAction.deleteRestHouseContactSystemFailed)),
    { dispatch: false }
  );

  //getRestHouseContactListSuccess
}
