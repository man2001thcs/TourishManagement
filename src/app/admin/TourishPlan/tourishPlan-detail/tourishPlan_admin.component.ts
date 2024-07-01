import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../service/admin.service";

import * as TourishPlanActions from "./tourishPlan-detail.store.action";
import { State as TourishPlanState } from "./tourishPlan-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editTourishPlan,
  getTourishPlan,
  getMessage,
  getSysError,
} from "./tourishPlan-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import {
  Instruction,
  TourishCategoryRelation,
  TourishPlan,
  TourishSchedule,
} from "src/app/model/baseModel";
import { TourishPlanParam } from "./tourishPlan-detail.component.model";

@Component({
  selector: "app-tourishPlan-detail",
  templateUrl: "./tourishPlan-detail.component.html",
  styleUrls: ["./tourishPlan-detail.component.css"],
})
export class TourishPlanDetailAdminComponent implements OnInit, OnDestroy {
  tourishPlanId: string = "";
  isEditing: boolean = true;
  isSubmitting = false;
  active = 1;
  editorContent = "";
  disabled = true;

  scheduleList: TourishSchedule[] = [];

  tourishPlan: TourishPlan = {
    id: "",
    tourName: "",

    startingPoint: "",
    endPoint: "",

    supportNumber: "",

    description: "",

    stayingSchedules: [],
    eatSchedules: [],
    movingSchedules: [],
    tourishCategoryRelations: [],
  };

  tourishCategoryRelations: TourishCategoryRelation[] = [];

  isSubmitted = false;

  tourishPlanParam!: TourishPlanParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;
  editformGroup_status!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  tourishPlanState!: Observable<any>;
  editTourishPlanState!: Observable<any>;
  subscriptions: Subscription[] = [];
  currentRouter = "";
  instructionList: Instruction[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<TourishPlanState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    this.tourishPlanState = this.store.select(getTourishPlan);
    this.editTourishPlanState = this.store.select(editTourishPlan);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.tourishPlanId = this._route.snapshot.paramMap.get("id") ?? "";
    this.currentRouter = this.router.url;

    this.editformGroup_info = this.fb.group({
      id: [this.tourishPlanId, Validators.compose([Validators.required])],
      tourName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      startingPoint: ["", Validators.compose([Validators.required])],
      endingPoint: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      movingScheduleString: ["", Validators.compose([Validators.required])],
      eatingScheduleString: ["", Validators.compose([Validators.required])],
      stayingScheduleString: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.tourishPlanState.subscribe((state) => {
        if (state) {
          this.tourishPlan = state;
          this.editformGroup_info.controls["tourName"].setValue(state.tourName);

          this.editformGroup_info.controls["startingPoint"].setValue(
            state.startingPoint
          );

          this.editformGroup_info.controls["endingPoint"].setValue(
            state.endPoint
          );

          this.editformGroup_info.controls["supportNumber"].setValue(
            state.supportNumber
          );

          this.editformGroup_info.controls["eatingScheduleString"].setValue(
            JSON.stringify(state.eatSchedules)
          );

          this.editformGroup_info.controls["movingScheduleString"].setValue(
            JSON.stringify(state.movingSchedules)
          );

          this.editformGroup_info.controls["stayingScheduleString"].setValue(
            JSON.stringify(state.stayingSchedules)
          );

          this.scheduleList = state.tourishScheduleList ?? [];
          this.tourishCategoryRelations = state.tourishCategoryRelations ?? [];

          this.messageService.closeLoadingDialog();
        }
      })
    );

    this.subscriptions.push(
      this.editTourishPlanState.subscribe((state) => {
        if (state) {
          this.messageService.closeAllDialog();
          this.messageService
            .openMessageNotifyDialog(state.messageCode)
            ?.subscribe(() => {
              this.reLoad();
            });

          this.store.dispatch(
            TourishPlanActions.getTourishPlan({
              payload: {
                id: this.tourishPlanId,
              },
            })
          );
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

    this._route.paramMap.subscribe((query) => {
      this.tourishPlanId = query.get("id") ?? "";

      if (this.tourishPlanId.length > 0) {
        this.store.dispatch(
          TourishPlanActions.getTourishPlan({
            payload: {
              id: this.tourishPlanId,
            },
          })
        );
      }

      this.messageService.openLoadingDialog();
    });
   

    this.store.dispatch(TourishPlanActions.initial());

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  reLoad() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.store.dispatch(TourishPlanActions.resetTourishPlan());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    this.editformGroup_info.controls["description"].setValue(
      this.editorContent
    );
    let tourishCategoryRelationInsert: TourishCategoryRelation[] = [];

    this.tourishCategoryRelations.forEach((relation) => {
      tourishCategoryRelationInsert = [
        ...tourishCategoryRelationInsert,
        {
          tourishCategory: relation.tourishCategory,
        },
      ];
    });

    if (this.editformGroup_info.valid) {
      this.messageService.openLoadingDialog();
      this.store.dispatch(
        TourishPlanActions.editTourishPlan({
          payload: {
            id: this.tourishPlanId,
            tourName: this.editformGroup_info.value.tourName,

            startingPoint: this.editformGroup_info.value.startingPoint,
            endPoint: this.editformGroup_info.value.endingPoint,

            supportNumber: this.editformGroup_info.value.supportNumber,

            description: this.editorContent,

            tourishCategoryRelations: tourishCategoryRelationInsert,
            tourishScheduleList: this.scheduleList,
            instructionList: this.instructionList,

            movingScheduleString:
              this.editformGroup_info.value.movingScheduleString,
            EatingScheduleString:
              this.editformGroup_info.value.eatingScheduleString,
            stayingScheduleString:
              this.editformGroup_info.value.stayingScheduleString,
          },
        })
      );
    } else {
      this.messageService.openFailNotifyDialog(
        "Lỗi giá trị đầu vào. Vui lòng kiểm tra lại"
      );
    }

    this.messageService.openLoadingDialog();
  }

  formReset_create_info(): void {
    this.isSubmitting = false;

    this.editformGroup_info.patchValue({
      tourName: this.tourishPlan.tourName,

      startingPoint: this.tourishPlan.startingPoint,
      endingPoint: this.tourishPlan.endPoint,

      supportNumber: this.tourishPlan.supportNumber,

      description: this.tourishPlan.description,

      movingScheduleString: JSON.stringify(this.tourishPlan.movingSchedules),
      EatingScheduleString: JSON.stringify(this.tourishPlan.eatSchedules),
      stayingScheduleString: JSON.stringify(this.tourishPlan.stayingSchedules),
    });

    this.tourishCategoryRelations =
      this.tourishPlan.tourishCategoryRelations ?? [];

    this.scheduleList = this.tourishPlan.tourishScheduleList ?? [];

    this.instructionList = this.tourishPlan.instructionList ?? [];
  }

  openDialog() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn rời đi?",
      },
    });
    return ref.afterClosed();
  }

  saveInfomation(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn lưu lại không?",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.formSubmit_create_info();
    });
  }

  getTotalPrice(): number {
    let totalPrice = 0;

    this.tourishPlan.stayingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    this.tourishPlan.eatSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    this.tourishPlan.movingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    return totalPrice;
  }

  uploadFinished(event: any) {}

  checkDeactivate(
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return !this.editformGroup_info.dirty || this.openDialog();
  }

  selectChangeCategory = (event: any) => {
    this.tourishCategoryRelations = event.data;
  };

  selectChangeSchedule = (event: any) => {
    this.scheduleList = event.data;
  };

  selectChangeInstruction = (event: any) => {
    this.instructionList = event.data;
  };

  selectChangeStaying = (event: any) => {
    this.editformGroup_info.controls["stayingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };

  selectChangeEating = (event: any) => {
    this.editformGroup_info.controls["eatingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };

  selectChangeMoving = (event: any) => {
    this.editformGroup_info.controls["movingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };

  getTinyMceResult($event: any) {
    this.editorContent = $event.data;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
}
