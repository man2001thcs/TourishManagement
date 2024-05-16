import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { UserService } from "../../../utility/user_service/user.service";
import { HashService } from "../../../utility/user_service/hash.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription, timeout } from "rxjs";
import { LoginUnionActions } from "./login.store.action";
import { Store } from "@ngrx/store";
import {
  getLoginProfile,
  getMessage,
  getSysError,
} from "./login.store.selector";
import * as LoginAction from "./login.store.action";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { MessageService } from "src/app/utility/user_service/message.service";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface DialogSignInData {
  title: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  signInformGroup!: FormGroup;
  errorMessage = "";

  getLoginProfile: Observable<any>;

  errorMessageState: Observable<any>;
  errorSystemState: Observable<any>;

  subscriptions: Subscription[] = [];
  loginProfile: any;
  activated = "1";

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private messageService: MessageService,
    private hash: HashService,
    private router: Router,
    private store: Store<LoginUnionActions>,
    private socialAuthService: SocialAuthService,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.getLoginProfile = this.store.select(getLoginProfile);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.activated = this._route.snapshot.queryParamMap.get("activated") ?? "";
    console.log(this.activated);

    if (this.activated == "1")
      this.openSnackBar(
        "Tài khoản đã xác nhận thành công, hãy đăng nhập",
        "Đóng"
      );

    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.store.dispatch(
        LoginAction.login({
          payload: {
            userName: user.email,
            password: "None",
            role: 0,
            email: user.email,
            fullName: user.firstName + " " + user.lastName,
            address: "Chưa có",
            phoneNumber: "Chưa có",
            googleToken: user.idToken,
            loginPhase: "GoogleSignIn",
          },
        })
      );
      this.messageService.openLoadingDialog();
    });

    this.signInformGroup = this.fb.group({
      userName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.subscriptions.push(
      this.getLoginProfile.subscribe((state) => {
        if (state) {
          this.loginProfile = state;

          this.messageService.closeLoadingDialog();

          const response = JSON.parse(
            window.atob(state.accessToken.split(".")[1])
          );

          this.tokenStorage.saveToken(state.accessToken);
          this.tokenStorage.saveRefreshToken(state.refreshToken);
          this.tokenStorage.saveUser(response);
          console.log(response);

          this.messageService
            .openNotifyDialog("Đăng nhập thành công")
            .subscribe((res) => {
              if (response) {
                console.log(response);
                if (response.Role === "New") {
                  this.messageService.openNotifyDialog(
                    "Tài khoản đã liên kết, vui lòng chờ admin xét duyệt"
                  );
                }
                if (response.Role === "User") {
                  this.router.navigate(["/user/main-page"]);
                } else if (response.Role === "Admin") {
                  this.router.navigate(["/admin/dash-board"]);
                }
              }
            });
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state.code);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.store.dispatch(LoginAction.initial());
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(LoginAction.resetLogin());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { verticalPosition: "top",  duration: 5000,  });
  }

  valueChange(target: string, event: Event) {
    this.signInformGroup.value[target] = event;
    console.log(event);
  }

  formReset(): void {
    this.signInformGroup.setValue({
      userName: "man2001thcs",
      password: "123",
      loginPhase: "login",
    });
  }

  navigateRegister() {
    this.router.navigate(["guest/signIn"]);
  }

  formSubmit(): void {
    this.store.dispatch(
      LoginAction.login({
        payload: {
          userName: this.signInformGroup.value.userName,
          password: this.signInformGroup.value.password,
          loginPhase: "login",
        },
      })
    );

    this.messageService.openLoadingDialog();
  }

  signInWithGoogle() {
    this.tokenStorage.signInWithGoogle();
  }
}
