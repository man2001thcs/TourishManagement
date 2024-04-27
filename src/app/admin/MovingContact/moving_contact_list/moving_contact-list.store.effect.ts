import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { MovingContactListStoreService } from "./moving_contact-list.store.service";
import * as MovingContactListAction from "./moving_contact-list.store.action";
import { MovingContactListUnionActions } from "./moving_contact-list.store.action";

@Injectable()
export class MovingContactListEffects {
  constructor(
    private action: Actions<MovingContactListAction.MovingContactListUnionActions>,
    private storeService: MovingContactListStoreService
  ) {}

  getMovingContactList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactListAction.getMovingContactList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingContactList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
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

  deleteMovingContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactListAction.deleteMovingContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteMovingContact(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return MovingContactListAction.deleteMovingContactSuccess({
                response: response,
              });
            } else {
              return MovingContactListAction.deleteMovingContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              MovingContactListAction.deleteMovingContactSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteMovingContactListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactListAction.deleteMovingContactSuccess)),
    { dispatch: false }
  );

  deleteMovingContactListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactListAction.deleteMovingContactFailed)),
    { dispatch: false }
  );

  deleteMovingContactListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(MovingContactListAction.deleteMovingContactSystemFailed)),
    { dispatch: false }
  );

  //getMovingContactListSuccess
}
