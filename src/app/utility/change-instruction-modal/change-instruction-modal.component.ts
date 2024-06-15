import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MessageService } from "../user_service/message.service";
import { InterestModalParam } from "./change-instruction-modal.component.model";
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
  Instruction,
} from "src/app/model/baseModel";

@Component({
  selector: "app-instruction-change",
  templateUrl: "change-instruction-modal.component.html",
  styleUrls: ["change-instruction-modal.component.css"],
})
export class InstructionChangeModalComponent implements OnInit {
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

  instructionList: Instruction[] = [];
  instructionEditList: Instruction[] = [];

  targetId = "";
  targetType = "";

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InstructionChangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterestModalParam
  ) {}

  ngOnInit(): void {
    this.disabled = this.data.disabled ?? false;
    this.tourishPlanId = this.data.tourishPlanId ?? "";
    this.movingScheduleId = this.data.movingScheduleId ?? "";
    this.stayingScheduleId = this.data.stayingScheduleId ?? "";

    if (this.tourishPlanId.length > 0 ){
      this.targetId = this.tourishPlanId;
      this.targetType = "TourishPlan";
    }
    if (this.movingScheduleId.length > 0){
      this.targetId = this.movingScheduleId;
      this.targetType = "MovingSchedule";
    } 
    if (this.stayingScheduleId.length > 0){
      this.targetId = this.stayingScheduleId;
      this.targetType = "StayingSchedule";
    } 

    this.getInstruction();
  }

  doAction(action: boolean) {
    if (action) {
      this.changeInstruction();
    }
  }

  getInstruction() {
    let targetUrl = "";

    if (this.tourishPlanId.length > 0) {

      this.http
        .get("/api/GetTourishPlan/" + this.tourishPlanId)
        .subscribe((response: any) => {
          if (response) {
            if (response.resultCd == 0) {
              this.tourishPlan = response.data;
              this.instructionList = this.tourishPlan.instructionList ?? [];
              this.instructionEditList = this.instructionList;
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
              this.instructionList = this.movingSchedule.instructionList ?? [];
              this.instructionEditList = this.instructionList;

              console.log(this.instructionList);
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
              this.instructionList =
                this.stayingSchedule.instructionList ?? [];
                this.instructionEditList = this.instructionList;

                console.log(this.instructionList);
            }
          }
        });
    }

    return true;
  }

  selectChangeInstruction = (event: any) => {
    console.log(event.data);
    this.instructionEditList = event.data;
  };

  changeInstruction() {
   
    console.log(this.stayingScheduleId);

    if (this.tourishPlanId.length > 0) {
      let payload = this.tourishPlan;
      payload.instructionList = this.instructionEditList;

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
      payload.instructionList = this.instructionEditList;

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
      payload.instructionList = this.instructionEditList;

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
      this.instructionList = this.tourishPlan.instructionList ?? [];
    }

    if (this.movingScheduleId.length > 0) {
      this.instructionList = this.movingSchedule.instructionList ?? [];
    }

    if (this.stayingScheduleId.length > 0) {
      this.instructionList = this.stayingSchedule.instructionList ?? [];
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
