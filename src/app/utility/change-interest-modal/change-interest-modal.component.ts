import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MessageService } from "../user_service/message.service";
import { InterestModalParam } from "./change-interest-modal.component.model";
import { TokenStorageService } from "../user_service/token.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-avatar-modal-upload",
  templateUrl: "change-interest-modal.component.html",
  styleUrls: ["change-interest-modal.component.css"],
})
export class InterestModalComponent implements OnInit {
  resourceId = "";
  resourceType = "";

  interest = 0;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InterestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterestModalParam
  ) {}

  ngOnInit(): void {
    this.resourceId = this.data.resourceId;
    this.resourceType = this.data.resourceType;
  }

  doAction(action: boolean) {
    if (action) {
      this.changeInterest();
    }
  }

  changeInterest() {
    let targetUrl = "";
    if (this.resourceType === "TourishPlan") {
      const payload = {
        tourishPlanId: this.resourceId,
        interestStatus: 2,
      };

      this.messageService.openLoadingDialog();
      this.http
        .put("/api/Update" + this.resourceType + "/interest", payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            } else
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
          }
        });
    }

    if (this.resourceType === "MovingSchedule") {
      const payload = {
        scheduleId: this.resourceId,
        interestStatus: 2,
      };

      this.messageService.openLoadingDialog();
      this.http
        .put("/api/Update" + this.resourceType + "/interest", payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            } else
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
          }
        });
    }

    if (this.resourceType === "StayingSchedule") {
      const payload = {
        scheduleId: this.resourceId,
        interestStatus: 2,
      };

      this.messageService.openLoadingDialog();
      this.http
        .put("/api/Update" + this.resourceType + "/interest", payload)
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeLoadingDialog();
            if (response.resultCd == 0) {
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
            } else
              this.messageService
                .openMessageNotifyDialog(response.messageCode)
                ?.subscribe(() => {
                  this.dialogRef.close(true);
                });
          }
        });
    }

    return true;
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
