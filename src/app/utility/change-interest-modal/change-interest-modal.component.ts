import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MessageService } from "../user_service/message.service";
import { InterestModalParam } from "./change-interest-modal.component.model";
import { TokenStorageService } from "../user_service/token.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-avatar-modal-upload",
  templateUrl: "imageUpload.component.html",
  styleUrls: ["imageUpload.component.css"],
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
    if (action){
      this.changeInterest();
    }
    this.dialogRef.close(action);
  }

  changeInterest() {
    let targetUrl = "";
    if (this.resourceType === "TourishPlan") {
      const payload = {
        tourishPlanId : this.resourceId, 
        interestType: 3
      };

      this.http.post("/api/Add" + this.resourceType + "/interest", payload).subscribe((response: any) => {
        if (response){
          if (response.resultCd == 0){
            this.messageService.openMessageNotifyDialog("I433");
          }
        }
      });
    }

    if (this.resourceType === "MovingSchedule") {
      const payload = {
        movingScheduleId : this.resourceId,
        interestType: 0
      };

      this.http.post("/api/Add" + this.resourceType + "/interest", payload).subscribe((response: any) => {
        if (response){
          if (response.resultCd == 0){
            this.messageService.openMessageNotifyDialog("I433");
          }
        }
      });
    }

    if (this.resourceType === "StayingSchedule") {
      const payload = {
        stayingSchedule : this.resourceId,
        interestType: 0
      };

      this.http.post("/api/Add" + this.resourceType + "/interest", payload).subscribe((response: any) => {
        if (response){
          if (response.resultCd == 0){
            this.messageService.openMessageNotifyDialog("I433");
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
