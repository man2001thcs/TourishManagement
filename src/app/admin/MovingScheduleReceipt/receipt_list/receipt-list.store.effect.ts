import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { ReceiptListStoreService } from "./receipt-list.store.service";
import * as ReceiptListAction from "./receipt-list.store.action";
import { ReceiptListUnionActions } from "./receipt-list.store.action";

@Injectable()
export class ReceiptListEffects {
  constructor(
    private action: Actions<ReceiptListAction.ReceiptListUnionActions>,
    private storeService: ReceiptListStoreService
  ) {}

  getReceiptList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ReceiptListAction.getReceiptList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getReceiptList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return ReceiptListAction.getReceiptListSuccess({
                response: response,
              });
            } else {
              return ReceiptListAction.getReceiptListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              ReceiptListAction.getReceiptListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getReceiptListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptListAction.getReceiptListSuccess)),
    { dispatch: false }
  );

  getReceiptListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptListAction.getReceiptListFailed)),
    { dispatch: false }
  );

  getReceiptListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(ReceiptListAction.getReceiptListSystemFailed)),
    { dispatch: false }
  );

  deleteReceipt: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(ReceiptListAction.deleteReceipt),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteReceipt(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return ReceiptListAction.deleteReceiptSuccess({
                response: response,
              });
            } else {
              return ReceiptListAction.deleteReceiptFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              ReceiptListAction.deleteReceiptSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteReceiptListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptListAction.deleteReceiptSuccess)),
    { dispatch: false }
  );

  deleteReceiptListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(ReceiptListAction.deleteReceiptFailed)),
    { dispatch: false }
  );

  deleteReceiptListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(ReceiptListAction.deleteReceiptSystemFailed)),
    { dispatch: false }
  );

  //getReceiptListSuccess
}
