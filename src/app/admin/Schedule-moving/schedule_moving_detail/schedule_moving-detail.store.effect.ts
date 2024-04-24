import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { PassengerCarStoreService } from './passenger_car-detail.store.service';
import * as PassengerCarAction from './passenger_car-detail.store.action';
import { PassengerCarUnionActions } from './passenger_car-detail.store.action';

@Injectable()
export class PassengerCarEffects {
  constructor(
    private action: Actions<PassengerCarAction.PassengerCarUnionActions>,
    private storeService: PassengerCarStoreService
  ) {}

  getPassengerCar: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(PassengerCarAction.getPassengerCar),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getPassengerCar(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return PassengerCarAction.getPassengerCarSuccess({
                response: response,
              });
            } else {
              return PassengerCarAction.getPassengerCarFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(PassengerCarAction.getPassengerCarSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getPassengerCarSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.getPassengerCarSuccess)),
    { dispatch: false }
  );

  getPassengerCarFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.getPassengerCarFailed)),
    { dispatch: false }
  );

  getPassengerCarSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.getPassengerCarSystemFailed)),
    { dispatch: false }
  );

  editPassengerCar: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(PassengerCarAction.editPassengerCar),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editPassengerCar(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return PassengerCarAction.editPassengerCarSuccess({
                response: response,
              });
            } else {
              return PassengerCarAction.editPassengerCarFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(PassengerCarAction.editPassengerCarSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editPassengerCarSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.editPassengerCarSuccess)),
    { dispatch: false }
  );

  editPassengerCarFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.editPassengerCarFailed)),
    { dispatch: false }
  );

  editPassengerCarSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarAction.editPassengerCarSystemFailed)),
    { dispatch: false }
  );

  //editPassengerCarSuccess
}
