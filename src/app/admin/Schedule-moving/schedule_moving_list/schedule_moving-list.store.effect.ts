import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { PassengerCarListStoreService } from "./passenger_car-list.store.service";
import * as PassengerCarListAction from "./passenger_car-list.store.action";
import { PassengerCarListUnionActions } from "./passenger_car-list.store.action";

@Injectable()
export class PassengerCarListEffects {
  constructor(
    private action: Actions<PassengerCarListAction.PassengerCarListUnionActions>,
    private storeService: PassengerCarListStoreService
  ) {}

  getPassengerCarList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(PassengerCarListAction.getPassengerCarList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getPassengerCarList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return PassengerCarListAction.getPassengerCarListSuccess({
                response: response,
              });
            } else {
              return PassengerCarListAction.getPassengerCarListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              PassengerCarListAction.getPassengerCarListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getPassengerCarListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarListAction.getPassengerCarListSuccess)),
    { dispatch: false }
  );

  getPassengerCarListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarListAction.getPassengerCarListFailed)),
    { dispatch: false }
  );

  getPassengerCarListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(PassengerCarListAction.getPassengerCarListSystemFailed)),
    { dispatch: false }
  );

  deletePassengerCar: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(PassengerCarListAction.deletePassengerCar),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deletePassengerCar(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return PassengerCarListAction.deletePassengerCarSuccess({
                response: response,
              });
            } else {
              return PassengerCarListAction.deletePassengerCarFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              PassengerCarListAction.deletePassengerCarSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deletePassengerCarListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarListAction.deletePassengerCarSuccess)),
    { dispatch: false }
  );

  deletePassengerCarListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(PassengerCarListAction.deletePassengerCarFailed)),
    { dispatch: false }
  );

  deletePassengerCarListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(PassengerCarListAction.deletePassengerCarSystemFailed)),
    { dispatch: false }
  );

  //getPassengerCarListSuccess
}
