import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthorTagDynamicComponent } from "./utility/author-tag-dynamic/author-tag-dynamic.component";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { NotifyDialogComponent } from "./utility/notification_admin/notify-dialog.component";
import { FailNotifyDialogComponent } from "./utility/notification_admin/fail-notify-dialog.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./utility/user_service/http.inceptor";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

import { CommonModule } from "@angular/common";
import { LoadingDialogComponent } from "./utility/notification_admin/loading-dialog.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    AuthorTagDynamicComponent,
    NotifyDialogComponent,
    FailNotifyDialogComponent,
    LoadingDialogComponent,
  ],
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    CommonModule,

    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SocialLoginModule,
    MatButtonModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '614502632255-431u4lhjtostn9rpngh1vtqolujli60d.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
