import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { MovingContactStoreService } from './moving_contact-create.store.service';
import * as MovingContactAction from './moving_contact-create.store.action';
import { MovingContactUnionActions } from './moving_contact-create.store.action';

@Injectable()
export class MovingContactCreateEffects {
  constructor(
    private action: Actions<MovingContactAction.MovingContactUnionActions>,
    private storeService: MovingContactStoreService
  ) {}

  createMovingContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(MovingContactAction.createMovingContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createMovingContact(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return MovingContactAction.createMovingContactSuccess({
                response: response,
              });
            } else {
              return MovingContactAction.createMovingContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(MovingContactAction.createMovingContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createMovingContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.createMovingContactSuccess)),
    { dispatch: false }
  );

  createMovingContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.createMovingContactFailed)),
    { dispatch: false }
  );

  createMovingContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(MovingContactAction.createMovingContactSystemFailed)),
    { dispatch: false }
  );

  //createMovingContactSuccess
}
