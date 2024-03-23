import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { NotificationStoreService } from './notification-create.store.service';
import * as NotificationAction from './notification-create.store.action';
import { NotificationUnionActions } from './notification-create.store.action';

@Injectable()
export class NotificationCreateEffects {
  constructor(
    private action: Actions<NotificationAction.NotificationUnionActions>,
    private storeService: NotificationStoreService
  ) {}

  createNotification: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(NotificationAction.createNotification),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createNotification(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return NotificationAction.createNotificationSuccess({
                response: response,
              });
            } else {
              return NotificationAction.createNotificationFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(NotificationAction.createNotificationSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createNotificationSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.createNotificationSuccess)),
    { dispatch: false }
  );

  createNotificationFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.createNotificationFailed)),
    { dispatch: false }
  );

  createNotificationSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.createNotificationSystemFailed)),
    { dispatch: false }
  );

  //createNotificationSuccess
}
