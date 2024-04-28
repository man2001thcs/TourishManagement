import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Observable, Subscription, catchError, finalize } from "rxjs";
import { MessageService } from "../user_service/message.service";

import { Store } from "@ngrx/store";
import { FileModalParam, FileModel } from "./imageUpload.component.model";
import { TokenStorageService } from "../user_service/token.service";
import { environment } from "src/environments/environment";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-avatar-modal-upload",
  templateUrl: "imageUpload.component.html",
  styleUrls: ["imageUpload.component.css"],
})
export class AvatarUploadModalComponent implements OnInit {
  resourceId = "";
  resourceType = 0;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: FileModalParam
  ) {}

  ngOnInit(): void {
    this.resourceId = this.data.resourceId;
    this.resourceType = this.data.resourceType;
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
