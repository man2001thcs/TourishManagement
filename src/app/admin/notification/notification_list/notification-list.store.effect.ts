import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { NotificationListStoreService } from "./notification-list.store.service";
import * as NotificationListAction from "./notification-list.store.action";
import { NotificationListUnionActions } from "./notification-list.store.action";

@Injectable()
export class NotificationListEffects {
  constructor(
    private action: Actions<NotificationListAction.NotificationListUnionActions>,
    private storeService: NotificationListStoreService
  ) {}

  getNotificationList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(NotificationListAction.getNotificationList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getNotificationList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return NotificationListAction.getNotificationListSuccess({
                response: response,
              });
            } else {
              return NotificationListAction.getNotificationListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              NotificationListAction.getNotificationListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getNotificationListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationListAction.getNotificationListSuccess)),
    { dispatch: false }
  );

  getNotificationListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationListAction.getNotificationListFailed)),
    { dispatch: false }
  );

  getNotificationListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(NotificationListAction.getNotificationListSystemFailed)),
    { dispatch: false }
  );

  deleteNotification: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(NotificationListAction.deleteNotification),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteNotification(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return NotificationListAction.deleteNotificationSuccess({
                response: response,
              });
            } else {
              return NotificationListAction.deleteNotificationFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              NotificationListAction.deleteNotificationSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteNotificationListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationListAction.deleteNotificationSuccess)),
    { dispatch: false }
  );

  deleteNotificationListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationListAction.deleteNotificationFailed)),
    { dispatch: false }
  );

  deleteNotificationListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(NotificationListAction.deleteNotificationSystemFailed)),
    { dispatch: false }
  );

  //getNotificationListSuccess
}
