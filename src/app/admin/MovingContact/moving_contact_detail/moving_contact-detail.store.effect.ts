import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovingContactStoreService } from './moving_contact-detail.store.service';
import * as MovingContactAction from './moving_contact-detail.store.action';
import { MovingContactUnionActions } from './moving_contact-detail.store.action';

@Injectable()
export class MovingContactEffects {
  constructor(
    private action: Actions<MovingContactAction.MovingContactUnionActions>,
    private storeService: MovingContactStoreService
  ) {}

  getMovingContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactAction.getMovingContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getMovingContact(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return MovingContactAction.getMovingContactSuccess({
                response: response,
              });
            } else {
              return MovingContactAction.getMovingContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingContactAction.getMovingContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getMovingContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.getMovingContactSuccess)),
    { dispatch: false }
  );

  getMovingContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.getMovingContactFailed)),
    { dispatch: false }
  );

  getMovingContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.getMovingContactSystemFailed)),
    { dispatch: false }
  );

  editMovingContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactAction.editMovingContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editMovingContact(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return MovingContactAction.editMovingContactSuccess({
                response: response,
              });
            } else {
              return MovingContactAction.editMovingContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingContactAction.editMovingContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editMovingContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.editMovingContactSuccess)),
    { dispatch: false }
  );

  editMovingContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.editMovingContactFailed)),
    { dispatch: false }
  );

  editMovingContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.editMovingContactSystemFailed)),
    { dispatch: false }
  );

  //editMovingContactSuccess
}
