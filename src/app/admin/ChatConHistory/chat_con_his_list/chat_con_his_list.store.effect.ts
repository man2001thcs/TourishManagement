import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { GuestMessageConHistoryListStoreService } from "./chat_con_his_list.store.service";
import * as GuestMessageConHistoryListAction from "./chat_con_his_list.store.action";
import { GuestMessageConHistoryListUnionActions } from "./chat_con_his_list.store.action";

@Injectable()
export class GuestMessageConHistoryListEffects {
  constructor(
    private action: Actions<GuestMessageConHistoryListAction.GuestMessageConHistoryListUnionActions>,
    private storeService: GuestMessageConHistoryListStoreService
  ) {}

  getGuestMessageConHistoryList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(GuestMessageConHistoryListAction.getGuestMessageConHistoryList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getGuestMessageConHistoryList(action).pipe(
          map((response) => {
            console.log(response);
            if (response.resultCd === 0) {
              console.log(response);
              return GuestMessageConHistoryListAction.getGuestMessageConHistoryListSuccess({
                response: response,
              });
            } else {
              return GuestMessageConHistoryListAction.getGuestMessageConHistoryListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              GuestMessageConHistoryListAction.getGuestMessageConHistoryListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getGuestMessageConHistoryListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(GuestMessageConHistoryListAction.getGuestMessageConHistoryListSuccess)),
    { dispatch: false }
  );

  getGuestMessageConHistoryListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(GuestMessageConHistoryListAction.getGuestMessageConHistoryListFailed)),
    { dispatch: false }
  );

  getGuestMessageConHistoryListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(GuestMessageConHistoryListAction.getGuestMessageConHistoryListSystemFailed)),
    { dispatch: false }
  );

  //getGuestMessageConHistoryListSuccess
}
