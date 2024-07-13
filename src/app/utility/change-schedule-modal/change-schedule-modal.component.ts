import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MessageService } from "../user_service/message.service";
import { InterestModalParam } from "./change-schedule-modal.component.model";
import { TokenStorageService } from "../user_service/token.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  MovingSchedule,
  StayingSchedule,
  TourishPlan,
  TourishSchedule,
} from "src/app/model/baseModel";

@Component({
  selector: "app-schedule-change",
  templateUrl: "change-schedule-modal.component.html",
  styleUrls: ["change-schedule-modal.component.css"],
})
export class ScheduleChangeModalComponent implements OnInit {
  resourceId = "";
  resourceType = "";

  interest = 0;
  disabled = false;
  tourishPlanId = "";
  movingScheduleId = "";
  stayingScheduleId = "";
  tourishPlan!: TourishPlan;
  movingSchedule!: MovingSchedule;
  stayingSchedule!: StayingSchedule;

  scheduleList: TourishSchedule[] = [];
  scheduleEditList: TourishSchedule[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ScheduleChangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterestModalParam
  ) {}

  ngOnInit(): void {
    this.disabled = this.data.disabled ?? false;
    this.tourishPlanId = this.data.tourishPlanId ?? "";
    this.movingScheduleId = this.data.movingScheduleId ?? "";
    this.stayingScheduleId = this.data.stayingScheduleId ?? "";

    this.getSchedule();
  }

  doAction(action: boolean) {
    if (action) {
      this.changeSchedule();
    }
  }

  getSchedule() {
    let targetUrl = "";

    if (this.tourishPlanId.length > 0) {

      this.http
        .get("/api/GetTourishPlan/" + this.tourishPlanId)
        .subscribe((response: any) => {
          if (response) {
            if (response.resultCd == 0) {
              this.tourishPlan = response.data;
              this.scheduleList = this.tourishPlan.tourishScheduleList ?? [];
              this.scheduleEditList = this.scheduleList;
            }
          }
        });
    }

    if (this.movingScheduleId.length > 0) {

      this.http
        .get("/api/GetMovingSchedule/" + this.movingScheduleId)
        .subscribe((response: any) => {
          if (response) {
            if (response.resultCd == 0) {
              this.movingSchedule = response.data;
              this.scheduleList = this.movingSchedule.serviceScheduleList ?? [];
              this.scheduleEditList = this.scheduleList;
            }
          }
        });
    }

    if (this.stayingScheduleId.length > 0) {

      this.http
        .get("/api/GetStayingSchedule/" + this.stayingScheduleId)
        .subscribe((response: any) => {
          if (response) {
            if (response.resultCd == 0) {
              this.stayingSchedule = response.data;
              this.scheduleList =
                this.stayingSchedule.serviceScheduleList ?? [];
                this.scheduleEditList = this.scheduleList;
            }
          }
        });
    }

    return true;
  }

  selectChangeSchedule = (event: any) => {
    
    this.scheduleEditList = event.data;
  };

  changeSchedule() {
    if (this.tourishPlanId.length > 0) {
      let payload = this.tourishPlan;
      payload.tourishScheduleList = this.scheduleEditList;

      this.messageService.openLoadingDialog();
      this.http
        .put("/api/UpdateTourishPlan/" + this.tourishPlanId, payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            }
          }
        });
    }

    if (this.movingScheduleId.length > 0) {
      let payload = this.movingSchedule;
      payload.serviceScheduleList = this.scheduleEditList;

      this.messageService.openLoadingDialog();
      this.http
      .put("/api/UpdateMovingSchedule/" + this.movingScheduleId, payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            }
          }
        });
    }

    if (this.stayingScheduleId.length > 0) {
      let payload = this.stayingSchedule;
      payload.serviceScheduleList = this.scheduleEditList;

      this.messageService.openLoadingDialog();
      this.http
      .put("/api/UpdateStayingSchedule/" + this.stayingScheduleId, payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            }
          }
        });
    }

    return true;
  }

  reset(){
    if (this.tourishPlanId.length > 0) {
      this.scheduleList = this.tourishPlan.tourishScheduleList ?? [];
    }

    if (this.movingScheduleId.length > 0) {
      this.scheduleList = this.movingSchedule.serviceScheduleList ?? [];
    }

    if (this.stayingScheduleId.length > 0) {
      this.scheduleList = this.stayingSchedule.serviceScheduleList ?? [];
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
