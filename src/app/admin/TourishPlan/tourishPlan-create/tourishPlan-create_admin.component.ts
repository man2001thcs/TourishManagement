import { Response } from "../../../model/response";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, Subscription, map } from "rxjs";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { NotifyDialogComponent } from "src/app/utility/notification_admin/notify-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { TourishPlan } from "src/app/model/baseModel";

import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";

import * as TourishPlanActions from "./tourishPlan-create.store.action";
import { State as TourishPlanState } from "./tourishPlan-create.store.reducer";
import { Store } from "@ngrx/store";
import { MessageService } from "src/app/utility/user_service/message.service";
import {
  getTourishPlan,
  getMessage,
  getSysError,
} from "./tourishPlan-create.store.selector";
@Component({
  selector: "app-tourishPlan-create",
  templateUrl: "./tourishPlan-create.component.html",
  styleUrls: ["./tourishPlan-create.component.css"],
})
export class TourishPlanCreateAdminComponent
  implements OnInit, OnDestroy, CheckDeactivate
{
  active = 1;
  isEditing: boolean = true;
  isSubmitting: boolean = false;

  coverMaterial = 0;
  this_announce = "";

  createformGroup!: FormGroup;
  isSubmitted = false;

  stayingSchedule: any;

  movingScheduleString: string = "";
  eatingScheduleString: string = "";
  stayingScheduleString: string = "";

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  tourishPlanState!: Observable<any>;

  authorListState!: Observable<any>;
  voucherListState!: Observable<any>;
  publishListState!: Observable<any>;
  categoryListState!: Observable<any>;

  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private store: Store<TourishPlanState>,
    private messageService: MessageService
  ) {
    this.tourishPlanState = this.store.select(getTourishPlan);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.createformGroup = this.fb.group({
      // tourName: [
      //   "",
      //   Validators.compose([Validators.required, Validators.minLength(3)]),
      // ],

      // startingPoint: ["", Validators.compose([Validators.required])],
      // endingPoint: ["", Validators.compose([Validators.required])],
      // supportNumber: ["", Validators.compose([Validators.required])],
      // planStatus: [0, Validators.compose([Validators.required])],
      // startDate: ["", Validators.compose([Validators.required])],
      // endDate: ["", Validators.compose([Validators.required])],

      // totalTicket: ["", Validators.compose([Validators.required])],
      // remainTicket: ["", Validators.compose([Validators.required])],
      // description: [
      //   "",
      //   Validators.compose([Validators.required, Validators.minLength(3)]),
      // ],

      tourName: [
        "Hà Nội - Đà Nẵng 4 ngày 3 đêm (Ví dụ)",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      startingPoint: ["", Validators.compose([Validators.required])],
      endingPoint: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      planStatus: [0, Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      totalTicket: [7, Validators.compose([Validators.required])],
      remainTicket: [2, Validators.compose([Validators.required])],
      description: [
        "Không có",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      movingScheduleString: [""],
      eatingScheduleString: [""],
      stayingScheduleString: [""],
    });

    this.subscriptions.push(
      this.tourishPlanState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openMessageNotifyDialog(state);
          }
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openFailNotifyDialog(state);
        }
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(TourishPlanActions.resetTourishPlan());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    console.log(this.createformGroup.valid);
    if (this.createformGroup.valid) {
      this.store.dispatch(
        TourishPlanActions.createTourishPlan({
          payload: {
            tourName: this.createformGroup.value.tourName,

            startingPoint: this.createformGroup.value.startingPoint,
            endPoint: this.createformGroup.value.endingPoint,

            supportNumber: this.createformGroup.value.supportNumber,
            planStatus: this.createformGroup.value.planStatus,
            startDate: this.createformGroup.value.startDate,
            endDate: this.createformGroup.value.endDate,

            totalTicket: this.createformGroup.value.totalTicket,
            remainTicket: this.createformGroup.value.remainTicket,
            description: this.createformGroup.value.description,

            movingScheduleString:
              this.createformGroup.value.movingScheduleString,
            EatingScheduleString:
              this.createformGroup.value.eatingScheduleString,
            stayingScheduleString:
              this.createformGroup.value.stayingScheduleString,
          },
        })
      );
      this.messageService.openLoadingDialog();
    }

    console.log(this.createformGroup.value);
  }

  formReset_create_info(): void {
    this.isSubmitting = true;
    this.createformGroup.setValue({
      tourName: "",

      startingPoint: "",
      endingPoint: "",

      supportNumber: "",
      planStatus: 0,
      startDate: "",
      endDate: "",

      totalTicket: 0,
      remainTicket: 0,
      description: "",

      movingScheduleString: "",
      EatingScheduleString: "",
      stayingScheduleString: "",
    });
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

  // changeCoverMaterial(event: any) {
  //   this.createformGroup.controls["coverMaterial"].setValue(event.value);

  //   console.log(this.createformGroup.value.coverMaterial);
  // }

  checkDeactivate(
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log("abc");
    return !this.createformGroup.dirty || this.openDialog();
  }

  // selectChange_author = (event: any) => {
  //   console.log(event.data);
  //   this.author_submit = [...event.data];
  //   //console.log(this.author_submit);
  //   this.authorSubmitString = this.author_submit.join(";");
  // };

  selectChangeStaying = (event: any) => {
    console.log(event.data);
    this.stayingScheduleString = JSON.stringify(event.data);
    this.createformGroup.controls["stayingScheduleString"].setValue(
      this.stayingScheduleString
    );
  };

  selectChangeEating = (event: any) => {
    console.log(event.data);
    this.eatingScheduleString = JSON.stringify(event.data);
    this.createformGroup.controls["eatingScheduleString"].setValue(
      this.eatingScheduleString
    );
  };

  selectChangeMoving = (event: any) => {
    console.log(event.data);
    this.movingScheduleString = JSON.stringify(event.data);
    this.createformGroup.controls["movingScheduleString"].setValue(
      this.movingScheduleString
    );
  };

  getJsonList(listString: string){
    if (listString === "") return [];
    return JSON.parse(listString);
  }
}
