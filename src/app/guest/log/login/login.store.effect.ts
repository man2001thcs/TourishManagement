import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { BooklistStoreService } from './login.store.service';
import * as LoginAction from './login.store.action';
import { LoginUnionActions } from './login.store.action';

@Injectable()
export class LoginEffects {
  constructor(
    private action: Actions<LoginAction.LoginUnionActions>,
    private storeService: BooklistStoreService
  ) {}

  login: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(LoginAction.login),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.login(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return LoginAction.loginSuccess({
                response: response,
              });
            } else {
              return LoginAction.loginFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(LoginAction.loginSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  loginSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(LoginAction.loginSuccess)),
    { dispatch: false }
  );

  loginFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(LoginAction.loginFailed)),
    { dispatch: false }
  );

  loginSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(LoginAction.loginSystemFailed)),
    { dispatch: false }
  );

  //loginSuccess
}
