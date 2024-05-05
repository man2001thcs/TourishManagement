import { Response } from "../../../model/response";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, Subscription, map } from "rxjs";
import {
  ConfirmDialogComponent,
  DialogData,
} from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { NotifyDialogComponent } from "src/app/utility/notification_admin/notify-dialog.component";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Book } from "src/app/model/book";
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";
import { StayingScheduleParam } from "./schedule_staying-create.component.model";
import * as MovingContactActions from "./schedule_staying-create.store.action";
import { State as schedule_stayingState } from "./schedule_staying-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createStayingSchedule,
  getMessage,
  getSysError,
} from "./schedule_staying-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { StayingSchedule } from "src/app/model/baseModel";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "app-book-create",
  templateUrl: "./schedule_staying-create.component.html",
  styleUrls: ["./schedule_staying-create.component.css"],
})
export class StayingScheduleCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  MovingContactParam!: StayingScheduleParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  MovingContactState!: Observable<any>;
  createStayingScheduleState!: Observable<any>;
  subscriptions: Subscription[] = [];

  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;
  color: ThemePalette = "primary";
  editorContent: any;
  restHouseType = 0;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<schedule_stayingState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: StayingScheduleParam
  ) {
    this.createStayingScheduleState = this.store.select(createStayingSchedule);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createStayingScheduleState.subscribe((state) => {
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

    this.store.dispatch(MovingContactActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
      id: ["", Validators.compose([Validators.required])],
      name: ["", Validators.compose([Validators.required])],
      placeName: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0],
      restHouseType: [0, Validators.compose([Validators.required])],
      restHouseBranchId: ["", Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingContactActions.resetStayingSchedule());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.setValue({
      name: "",
      placeName: "",
      supportNumber: "",
      singlePrice: null,
      restHouseType: null,
      restHouseBranchId: "",
      address: "",
      status: 0,
      description: "",
      startDate: null,
      endDate: null,
      createDate: null,
      updateDate: null,
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    this.createformGroup_info.controls["description"].setValue(
      this.editorContent
    );

    if (this.createformGroup_info.valid) {
      const payload: StayingSchedule = {
        name: this.createformGroup_info.value.name,
        placeName: this.createformGroup_info.value.placeName,
        address: this.createformGroup_info.value.address,
        supportNumber: this.createformGroup_info.value.supportNumber,
        singlePrice: parseInt(this.createformGroup_info.value.singlePrice),
        restHouseType: this.createformGroup_info.value.restHouseType,
        restHouseBranchId: this.createformGroup_info.value.restHouseBranchId,
        status: this.createformGroup_info.value.status,
        description: this.editorContent,
        startDate: this.createformGroup_info.value.startDate,
        endDate: this.createformGroup_info.value.endDate,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        // Assuming you're using NgRx store, replace MovingContactActions.createStayingSchedule with appropriate action
        // Also, make sure you import StayingSchedule and store accordingly
        MovingContactActions.createStayingSchedule({
          payload: payload,
        })
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectSchedule($event: any) {
    if ($event) {
      this.createformGroup_info.controls["restHouseBranchId"].setValue(
        $event.idList[0]
      );
      this.createformGroup_info.controls["placeName"].setValue(
        $event.nameList[0]
      );
    }
  }

  changeStatusExist($event: any) {
    this.createformGroup_info.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  changeType($event: any) {
    this.restHouseType = parseInt($event.target.value);
  }

  getTinyMceResult($event: any) {
    this.editorContent = $event.data;
  }
}
