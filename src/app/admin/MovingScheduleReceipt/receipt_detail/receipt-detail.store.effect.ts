import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ReceiptStoreService } from './receipt-detail.store.service';
import * as ReceiptAction from './receipt-detail.store.action';
import { ReceiptUnionActions } from './receipt-detail.store.action';

@Injectable()
export class ReceiptEffects {
  constructor(
    private action: Actions<ReceiptAction.ReceiptUnionActions>,
    private storeService: ReceiptStoreService
  ) {}

  getReceipt: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ReceiptAction.getReceipt),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getReceipt(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return ReceiptAction.getReceiptSuccess({
                response: response,
              });
            } else {
              return ReceiptAction.getReceiptFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(ReceiptAction.getReceiptSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getReceiptSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.getReceiptSuccess)),
    { dispatch: false }
  );

  getReceiptFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.getReceiptFailed)),
    { dispatch: false }
  );

  getReceiptSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.getReceiptSystemFailed)),
    { dispatch: false }
  );

  editReceipt: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ReceiptAction.editReceipt),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editReceipt(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return ReceiptAction.editReceiptSuccess({
                response: response,
              });
            } else {
              return ReceiptAction.editReceiptFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(ReceiptAction.editReceiptSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editReceiptSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.editReceiptSuccess)),
    { dispatch: false }
  );

  editReceiptFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.editReceiptFailed)),
    { dispatch: false }
  );

  editReceiptSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptAction.editReceiptSystemFailed)),
    { dispatch: false }
  );

  //editReceiptSuccess
}
