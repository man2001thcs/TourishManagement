import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { NotificationStoreService } from './notification-detail.store.service';
import * as NotificationAction from './notification-detail.store.action';
import { NotificationUnionActions } from './notification-detail.store.action';

@Injectable()
export class NotificationEffects {
  constructor(
    private action: Actions<NotificationAction.NotificationUnionActions>,
    private storeService: NotificationStoreService
  ) {}

  getNotification: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(NotificationAction.getNotification),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getNotification(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return NotificationAction.getNotificationSuccess({
                response: response,
              });
            } else {
              return NotificationAction.getNotificationFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(NotificationAction.getNotificationSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getNotificationSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.getNotificationSuccess)),
    { dispatch: false }
  );

  getNotificationFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.getNotificationFailed)),
    { dispatch: false }
  );

  getNotificationSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.getNotificationSystemFailed)),
    { dispatch: false }
  );

  editNotification: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(NotificationAction.editNotification),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editNotification(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return NotificationAction.editNotificationSuccess({
                response: response,
              });
            } else {
              return NotificationAction.editNotificationFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(NotificationAction.editNotificationSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editNotificationSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.editNotificationSuccess)),
    { dispatch: false }
  );

  editNotificationFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.editNotificationFailed)),
    { dispatch: false }
  );

  editNotificationSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(NotificationAction.editNotificationSystemFailed)),
    { dispatch: false }
  );

  //editNotificationSuccess
}
