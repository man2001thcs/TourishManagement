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
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from "@abacritt/angularx-social-login";
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
  passwordVisible = false;
  getLoginProfile: Observable<any>;

  errorMessageState: Observable<any>;
  errorSystemState: Observable<any>;

  subscriptions: Subscription[] = [];
  loginProfile: any;
  activated = "1";

  isRememberMeCheck = false;

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
    this.tokenStorage.signOut();

    const rememberMe = this.tokenStorage.returnRememberMe();

    this.activated = this._route.snapshot.queryParamMap.get("activated") ?? "";

    if (this.activated == "1")
      this.openSnackBar(
        "Tài khoản đã xác nhận thành công, hãy đăng nhập",
        "Đóng"
      );

    this.subscriptions.push(
      this.socialAuthService.authState.subscribe((user: SocialUser) => {
        if (user) {
          if (user.provider === "GOOGLE") {
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
          } else if (user.provider === "FACEBOOK") {
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
                  googleToken: user.authToken,
                  loginPhase: "FacebookSignIn",
                },
              })
            );
            this.messageService.openLoadingDialog();
          }
        }
      })
    );

    this.signInformGroup = this.fb.group({
      userName: [rememberMe.userName],
      password: [rememberMe.password],
      isRememberMeCheck: [rememberMe.userName.length > 0],
    });

    this.subscriptions.push(
      this.getLoginProfile.subscribe((state) => {
        if (state) {
          this.loginProfile = state;

          this.messageService.closeLoadingDialog();

          if (this.tokenStorage.getUser() != null) {
            this.socialAuthService.signOut();
          }

          // const response = JSON.parse(
          //   window.atob(state.accessToken.split(".")[1])
          // );

          const payloadBase64Url = state.accessToken.split(".")[1];
          const decodedPayload =
            this.tokenStorage.decodeBase64Url(payloadBase64Url);

          const response = JSON.parse(decodedPayload);

          this.tokenStorage.saveToken(state.accessToken);
          this.tokenStorage.saveRefreshToken(state.refreshToken);
          this.tokenStorage.saveUser(response);

          if (this.signInformGroup.value.isRememberMeCheck)
            this.tokenStorage.handleRememberMe(
              this.signInformGroup.value.userName,
              this.signInformGroup.value.password
            );
          else this.tokenStorage.cancelRememberMe();

          if (response.Role === "AdminTemp") {
            this.messageService.openFailNotifyDialog(
              "Vui lòng chờ Admin duyệt tài khoản của bạn"
            );
          } else if (response.Role === "New") {
            this.messageService.openFailNotifyDialog(
              "Vui lòng truy cập tài khoản email để xác thực tài khoản"
            );
          } else if (response.Role === "Cancelled") {
            this.messageService.openFailNotifyDialog(
              "Tài khoản của bạn đã bị khóa, vui lòng liên hệ CSKH để được hỗ trợ"
            );
          } else {
            this.messageService
              .openNotifyDialog("Đăng nhập thành công")
              .subscribe((res) => {
                if (response) {
                  if (response.Role === "New") {
                    this.messageService.openNotifyDialog(
                      "Tài khoản đã liên kết, vui lòng chờ admin xét duyệt"
                    );
                  }
                  if (response.Role === "User") {
                    this.router.navigate(["/user/main-page"]);
                  } else if (
                    response.Role === "Admin" ||
                    response.Role === "AdminManager"
                  ) {
                    this.router.navigate(["/admin/dash-board"]);
                  }
                }
              });
          }
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
    this.store.dispatch(LoginAction.resetLogin());
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      duration: 5000,
    });
  }

  valueChange(target: string, event: Event) {
    this.signInformGroup.value[target] = event;
  }

  formReset(): void {
    this.signInformGroup.setValue({
      userName: "",
      password: "",
      loginPhase: "login",
    });
  }

  navigateRegister() {
    this.router.navigate(["guest/signIn"]);
  }

  navigateReclaim() {
    this.router.navigate(["guest/reclaim"]);
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
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    //Facebook Login
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  isLogin() {
    if (
      this.tokenStorage.getUserRole() == "User" ||
      this.tokenStorage.getUserRole() == "Admin" ||
      this.tokenStorage.getUserRole() == "AdminManager"
    )
      return true;
    else return false;
  }

  onClickRevealPassword($event: any) {
    $event.preventDefault();
    this.passwordVisible = !this.passwordVisible;
  }
}
