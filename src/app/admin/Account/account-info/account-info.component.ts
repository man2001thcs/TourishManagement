import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, map } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AccountParam } from "./account-info.component.model";
import * as AccountActions from "./account-info.store.action";
import { State as AccountState } from "./account-info.store.reducer";
import { Store } from "@ngrx/store";
import {
  editAccount,
  getAccount,
  getMessage,
  getSysError,
} from "./account-info.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { User } from "src/app/model/baseModel";

@Component({
  selector: "app-account-info",
  templateUrl: "./account-info.component.html",
  styleUrls: ["./account-info.component.css"],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmittedInfo = false;
  isSubmittedPassword = false;
  id = "";
  active = 0;

  account: User = {
    id: "",
    userName: "",
    phoneNumber: "",
    email: "",
    address: "",
    fullName: "",
    role: 0,
  };
  accountParam!: AccountParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;
  editformGroup_password!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  accountState!: Observable<any>;
  editAccountState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<AccountState>,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private _route: ActivatedRoute
  ) {
    this.accountState = this.store.select(getAccount);
    this.editAccountState = this.store.select(editAccount);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.id = this.tokenStorageService.getUser().Id;
    this.editformGroup_info = this.fb.group({
      id: [this.id, Validators.compose([Validators.required])],
      userName: ["", Validators.compose([Validators.required])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required]),
      ],
      email: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      role: [
        { value: 0, disabled: true },
        Validators.compose([Validators.required]),
      ],
      fullName: [0, Validators.compose([Validators.required])],
    });

    this.editformGroup_password = this.fb.group({
      id: [this.id, Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
      newPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      reNewPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    this.subscriptions.push(
      this.accountState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.account = state;

          this.editformGroup_info.controls["userName"].setValue(state.userName);
          this.editformGroup_info.controls["phoneNumber"].setValue(
            state.phoneNumber
          );
          this.editformGroup_info.controls["email"].setValue(state.email);
          this.editformGroup_info.controls["address"].setValue(state.address);

          this.editformGroup_info.controls["role"].setValue(state.role);

          this.editformGroup_info.controls["fullName"].setValue(state.fullName);
        }
      })
    );

    this.subscriptions.push(
      this.editAccountState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
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

    this.store.dispatch(
      AccountActions.getAccount({
        payload: {
          id: this.id,
        },
      })
    );

    this.messageService.openLoadingDialog();
    this.store.dispatch(AccountActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(AccountActions.resetAccount());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.patchValue({
      userName: this.account.userName ?? "",
      phoneNumber: this.account.phoneNumber ?? "",
      email: this.account.email ?? "",
      address: this.account.address ?? "",
      role: this.account.role ?? 0,
      fullName: this.account.fullName ?? "",
    });
  }

  formSubmit(): void {
  }

  formSubmit_edit_info(): void {
    if (this.active === 0) {
      this.isSubmittedInfo = true;
      if (this.editformGroup_info.valid) {
        const payload = {
          id: this.id,
          userName: this.editformGroup_info.value.userName,
          phoneNumber: this.editformGroup_info.value.phoneNumber,
          email: this.editformGroup_info.value.email,
          address: this.editformGroup_info.value.address,
          fullName: this.editformGroup_info.value.fullName,
          role: this.tokenStorageService.getUserRoleInNumber(),
          phase: "",
        };

        this.messageService.openLoadingDialog();

        this.store.dispatch(
          AccountActions.editAccount({
            payload: payload,
          })
        );
      } else {
        this.messageService.openFailNotifyDialog(
          "Lỗi giá trị đầu vào. Vui lòng kiểm tra lại"
        );
      }
    } else if (this.active === 1) {
      this.isSubmittedPassword = true;
      if (this.editformGroup_password.valid) {
        const payload = {
          userName: this.tokenStorageService.getUser().UserName,
          password: this.editformGroup_password.value.password,
          newPassword: this.editformGroup_password.value.newPassword,
          role: this.tokenStorageService.getUserRoleInNumber(),
          phase: "Password",
        };

        this.messageService.openLoadingDialog();
        this.store.dispatch(
          AccountActions.editAccount({
            payload: payload,
          })
        );
      } else {
        this.messageService.openFailNotifyDialog(
          "Lỗi giá trị đầu vào. Vui lòng kiểm tra lại"
        );
      }
    }
  }

  changeIndex($event: number) {
    this.active = $event;
  }
}
