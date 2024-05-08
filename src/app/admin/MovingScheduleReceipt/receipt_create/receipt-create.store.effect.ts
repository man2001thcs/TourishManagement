import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ReceiptStoreService } from './receipt-create.store.service';
import * as ReceiptAction from './receipt-create.store.action';
import { ReceiptUnionActions } from './receipt-create.store.action';

@Injectable()
export class ReceiptCreateEffects {
  constructor(
    private action: Actions<ReceiptAction.ReceiptUnionActions>,
    private storeService: ReceiptStoreService
  ) {}

  createReceipt: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ReceiptAction.createReceipt),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createReceipt(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return ReceiptAction.createReceiptSuccess({
                response: response,
              });
            } else {
              return ReceiptAction.createReceiptFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(ReceiptAction.createReceiptSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createReceiptSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.createReceiptSuccess)),
    { dispatch: false }
  );

  createReceiptFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.createReceiptFailed)),
    { dispatch: false }
  );

  createReceiptSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.createReceiptSystemFailed)),
    { dispatch: false }
  );

  //createReceiptSuccess
}
