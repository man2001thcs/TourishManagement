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
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";

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
import { EatSchedule, TourishPlan } from "src/app/model/baseModel";
import { TourishPlanParam } from "./tourishPlan-detail.component.model";
declare let tinymce: any;

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
  tinyMceSetting: any;
  editorContent = "";

  tourishPlan: TourishPlan = {
    id: "",
    tourName: "",

    startingPoint: "",
    endPoint: "",

    supportNumber: "",
    planStatus: 0,
    startDate: "",
    endDate: "",

    totalTicket: 0,
    remainTicket: 0,
    description: "",

    stayingSchedules: [],
    eatSchedules: [],
    movingSchedules: [],
  };

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

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<TourishPlanState>,
    private messageService: MessageService,
    private _route: ActivatedRoute
  ) {
    this.tourishPlanState = this.store.select(getTourishPlan);
    this.editTourishPlanState = this.store.select(editTourishPlan);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.tourishPlanId = this._route.snapshot.paramMap.get("id") ?? "";

    this.editformGroup_info = this.fb.group({
      id: [this.tourishPlanId, Validators.compose([Validators.required])],
      tourName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      startingPoint: ["", Validators.compose([Validators.required])],
      endingPoint: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      planStatus: [0, Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      totalTicket: ["", Validators.compose([Validators.required])],
      remainTicket: ["", Validators.compose([Validators.required])],
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

          this.editformGroup_info.controls["totalTicket"].setValue(
            state.totalTicket
          );
          this.editformGroup_info.controls["remainTicket"].setValue(
            state.remainTicket
          );

          this.editformGroup_info.controls["planStatus"].setValue(
            state.planStatus
          );
          this.editformGroup_info.controls["description"].setValue(
            state.description
          );
          this.editorContent = state.description;
          this.editformGroup_info.controls["startDate"].setValue(
            state.startDate
          );

          this.editformGroup_info.controls["endDate"].setValue(state.endDate);

          this.editformGroup_info.controls["planStatus"].setValue(
            state.planStatus
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

          this.messageService.closeLoadingDialog();

          console.log(this.tourishPlan);
        }
      })
    );

    this.subscriptions.push(
      this.editTourishPlanState.subscribe((state) => {
        if (state) {
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

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
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      TourishPlanActions.getTourishPlan({
        payload: {
          id: this.tourishPlanId,
        },
      })
    );

    this.store.dispatch(TourishPlanActions.initial());

    //console.log(this.this_tourishPlan);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.tinyMceSetting = {
      base_url: "/tinymce", // Root for resources
      suffix: ".min", // Suffix to use when loading resources
      height: 500,
      menubar: true,
      file_picker_types: "file image media",
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "print",
        "preview",
        "anchor",
        "image",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "paste",
        "code",
        "help",
        "wordcount",
        "table",
        "codesample",
      ],
      // eslint-disable-next-line
      font_formats:
        "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; \
        Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; \
        Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; \
        Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; \
        Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; \
        Terminal=terminal,monaco; Times New Roman=times new roman,times; \
        Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; \
        Wingdings=wingdings,zapf dingbats",
      toolbar:
        "undo redo | formatselect | fontsizeselect | fontselect | image \
        | bold italic underline backcolor | codesample \
        | alignleft aligncenter alignright alignjustify | \
        | table tabledelete | tableprops tablerowprops tablecellprops \
        | tableinsertrowbefore tableinsertrowafter tabledeleterow \
        | tableinsertcolbefore tableinsertcolafter tabledeletecol \
        bullist numlist outdent indent | removeformat | fullscreen | help",
      // eslint-disable-next-line
      image_title: true,
      // eslint-disable-next-line
      automatic_uploads: true,
      // eslint-disable-next-line
      // eslint-disable-next-line
      file_picker_callback(cb: any, value: any, meta: any): void {
        // eslint-disable-next-line

        const element: HTMLInputElement | null =
          document.querySelector('input[type="file"]');

        if (element) {
          const fileSelectedPromise = new Promise<File | null>((resolve) => {
            element.onchange = () => {
              const file = element.files?.[0];
              resolve(file ?? null);
            };
          });

          // Trigger the click event
          element.click();

          // Wait for the promise to resolve
          fileSelectedPromise.then((file) => {
            console.log("No file selected");
            if (file) {
              // Handle the selected file, for example, log its details
              const reader = new FileReader();
              reader.onload = () => {
                const id = "blobid" + new Date().getTime();
                const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                if (reader.result !== null) {
                  const base64 = (reader.result as string).split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  /* call the callback and populate the Title field with the file name */
                  cb(blobInfo.blobUri(), { title: file.name });
                }
              };
              reader.readAsDataURL(file);

              // You can perform additional logic or trigger further actions with the file here
            } else {
              console.log("No file selected");
            }
          });
        }
      },
      // eslint-disable-next-line
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    };
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(TourishPlanActions.resetTourishPlan());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    this.editformGroup_info.controls["description"].setValue(
      this.editorContent
    );

    if (this.editformGroup_info.valid) {
      this.store.dispatch(
        TourishPlanActions.editTourishPlan({
          payload: {
            id: this.tourishPlanId,
            tourName: this.editformGroup_info.value.tourName,

            startingPoint: this.editformGroup_info.value.startingPoint,
            endPoint: this.editformGroup_info.value.endingPoint,

            supportNumber: this.editformGroup_info.value.supportNumber,
            planStatus: this.editformGroup_info.value.planStatus,
            startDate: this.editformGroup_info.value.startDate,
            endDate: this.editformGroup_info.value.endDate,

            totalTicket: this.editformGroup_info.value.totalTicket,
            remainTicket: this.editformGroup_info.value.remainTicket,
            description: this.editorContent,

            movingScheduleString:
              this.editformGroup_info.value.movingScheduleString,
            EatingScheduleString:
              this.editformGroup_info.value.eatingScheduleString,
            stayingScheduleString:
              this.editformGroup_info.value.stayingScheduleString,
          },
        })
      );
    }

    this.messageService.openLoadingDialog();
  }

  formReset_create_info(): void {
    this.isSubmitting = true;
    this.editformGroup_info.setValue({
      tourName: this.tourishPlan.tourName,

      startingPoint: this.tourishPlan.startingPoint,
      endingPoint: this.tourishPlan.endPoint,

      supportNumber: this.tourishPlan.supportNumber,
      planStatus: this.tourishPlan.planStatus,
      startDate: this.tourishPlan.startDate,
      endDate: this.tourishPlan.endDate,

      totalTicket: this.tourishPlan.totalTicket,
      remainTicket: this.tourishPlan.remainTicket,
      description: this.tourishPlan.description,

      movingScheduleString: JSON.stringify(this.tourishPlan.movingSchedules),
      EatingScheduleString: JSON.stringify(this.tourishPlan.eatSchedules),
      stayingScheduleString: JSON.stringify(this.tourishPlan.stayingSchedules),
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

  saveInfomation(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn lưu lại không?",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formSubmit_create_info();
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

  uploadFinished(event: any) {
    console.log(event);
  }

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

  selectChangeStaying = (event: any) => {
    console.log(event.data);
    this.editformGroup_info.controls["stayingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };

  selectChangeEating = (event: any) => {
    console.log(event.data);
    this.editformGroup_info.controls["eatingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };

  selectChangeMoving = (event: any) => {
    console.log(event.data);
    this.editformGroup_info.controls["movingScheduleString"].setValue(
      JSON.stringify(event.data)
    );
  };
}
