import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  Router,
} from "@angular/router";
import {
  Observable,
  Subscription,
  debounceTime,
} from "rxjs";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { NotifyDialogComponent } from "src/app/utility/notification_admin/notify-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import * as UserActions from "./reclaim.store.action";
import { State as UserState } from "./reclaim.store.reducer";
import { Store } from "@ngrx/store";
import { MessageService } from "src/app/utility/user_service/message.service";
import {
  reclaimUser,
  getMessage,
  getSysError,
  assignPassword,
} from "./reclaim.store.selector";
import { HttpClient } from "@angular/common/http";
import {
  getViErrMessagePhase
} from "src/app/utility/config/messageCode";
import { MatStepper } from "@angular/material/stepper";

export const matchPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  var match = false;

  if (control.get("password") !== null && control.get("rePassword") !== null) {
    if (control.get("password")!.value !== control.get("rePassword")!.value) {
      match = true;
    }
  }
  

  if (match) return { matchPassword: true };
  return null;
};

@Component({
  selector: "app-user-create",
  templateUrl: "./reclaim.component.html",
  styleUrls: ["./reclaim.component.css"],
})
export class ReclaimUserComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitting: boolean = false;

  index = 0;

  @ViewChild("accountInput") accountInput!: ElementRef<HTMLInputElement>;

  @ViewChild("stepper1") myStepper1!: MatStepper;
  @ViewChild("stepper2") myStepper2!: MatStepper;
  coverMaterial = 0;
  this_announce = "";

  reclaimFormGroup!: FormGroup;
  assignPasswordFormGroup!: FormGroup;
  submited = false;

  stayingSchedule: any;

  movingScheduleString: string = "";
  eatingScheduleString: string = "";
  stayingScheduleString: string = "";

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  userState!: Observable<any>;
  reclaimState!: Observable<any>;

  subscriptions: Subscription[] = [];

  accountMessage = "";

  isContinueStep1 = false;
  isContinueStep2 = false;
  isContinueStep3 = false;

  accountObservable!: Observable<string | null>;

  reclaimToken = "";

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private store: Store<UserState>,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userState = this.store.select(reclaimUser);
    this.reclaimState = this.store.select(assignPassword);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.reclaimToken =
      this._route.snapshot.queryParamMap.get("reclaim-token") ?? "";

    this.reclaimFormGroup = this.fb.group({
      userName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.assignPasswordFormGroup = this.fb.group(
      {
        password: [
          "",
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
        rePassword: [
          "",
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
      },
      { validators: matchPasswordValidator }
    );

    this.subscriptions.push(
      this.reclaimFormGroup?.controls["userName"].valueChanges
        .pipe(debounceTime(2000))
        .subscribe((state: string) => {
          var payload = {
            reclaimInfo: state,
          };

          if (state.length >= 3) {
            this.http
              .post("/api/User/CheckExist/reclaim", null, { params: payload })
              .subscribe((returnValue: any) => {
                const messageCode: string = returnValue?.messageCode;
                if (messageCode.charAt(0) === "C") {
                  this.accountMessage = getViErrMessagePhase(messageCode);
                  this.isContinueStep1 = false;
                } else {
                  if (messageCode.charAt(0) === "I") {
                    this.accountMessage = "";
                  }
                  this.isContinueStep1 = true;
                }
              });
          }
        })
    );

    this.subscriptions.push(
      this.userState.subscribe((state) => {
        this.messageService.closeLoadingDialog();
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);
          const messageCode: string = state?.messageCode;
          if (messageCode.charAt(0) === "I") {
            this.myStepper1.next();
          }
        }
      })
    );

    this.subscriptions.push(
      this.reclaimState.subscribe((state) => {
        this.messageService.closeLoadingDialog();
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);
          const messageCode: string = state?.messageCode;
          if (messageCode.charAt(0) === "I") {
            
            this.myStepper2.next();
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
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(UserActions.resetUser());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formSubmit_reclaim_info(): void {
    this.submited = true;
    if (this.reclaimFormGroup.valid) {
      this.messageService.openLoadingDialog();
      this.store.dispatch(
        UserActions.reclaimUser({
          payload: {
            reclaimInfo: this.reclaimFormGroup.value.userName,
            signInPhase: "ReclaimReq",
          },
        })
      );
    }
  }

  formSubmit_assign_info(): void {
    this.submited = true;
    if (this.assignPasswordFormGroup.valid) {
      this.messageService.openLoadingDialog();
      this.store.dispatch(
        UserActions.assignPassword({
          payload: {
            newPassword: this.assignPasswordFormGroup.value.password,
            reclaimToken: this.reclaimToken,
          },
        })
      );
    }
  }

  openDialog() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn rời đi?",
      },
    });
    return ref.afterClosed();
  }

  openNotifyDialog() {
    const ref = this.dialog.open(NotifyDialogComponent, {
      data: {
        title: this.this_announce,
      },
    });
    return ref.afterClosed();
  }

  toLoginPage() {
    this.router.navigate(["/guest/login"]);
  }

  // selectChange_author = (event: any) => {
  //   
  //   this.author_submit = [...event.data];
  //   //console.log(this.author_submit);
  //   this.authorSubmitString = this.author_submit.join(";");
  // };
}
