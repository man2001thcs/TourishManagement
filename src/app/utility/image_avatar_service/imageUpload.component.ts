import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Subscription, finalize } from "rxjs";
import { MessageService } from "../user_service/message.service";
import { FileModel } from "./imageUpload.component.model";
import { TokenStorageService } from "../user_service/token.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-avatar-upload",
  templateUrl: "imageUpload.component.html",
  styleUrls: ["imageUpload.component.css"],
})
export class AvatarUploadComponent implements OnInit, OnDestroy {
  @Input()
  productId = "";
  @Input()
  productType: number = 0;

  @Input()
  requiredFileType?: string;
  @Output() public onUploadFinished = new EventEmitter();

  @ViewChild("file") fileInputRef!: ElementRef;

  fileName = "";
  uploadProgress?: number;
  uploadSub!: Subscription;

  anonymousUrl =
    environment.backend.blobURL +
    "/" +
    this.productType +
    "-container/" +
    this.productType +
    "_anonymus.png";

  imageList!: FileModel[];
  subscriptions: Subscription[] = [];

  filesToUpload: File[] = [];

  urlList: string[] = [];
  urlListOld: string[] = [];

  imageDeleteList: string[] = [];

  progress = 0;
  total = 100;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.productType === 0) {
      const userId = this.tokenStorage.getUser().Id;
      this.productId = userId;
    }
    this.getImageList();
  }

  changeFile(files: any) {
    if (files === null || files.length <= 0) {
      return;
    }

    var reader = new FileReader();

    reader.readAsDataURL(files[0]); // read file as data url

    reader.onload = (event) => {
      // called once readAsDataURL is completed
      this.urlList = [...this.urlList, (event.target?.result ?? "").toString()];

      if (files) {
        this.filesToUpload.push(files[0]);
      }
    };
  }

  removeFile(index: any) {
    if (index === null) {
      return;
    }

    this.urlList.splice(index, 1);
    this.filesToUpload.splice(index, 1);

    this.fileInputRef.nativeElement.value = "";
  }

  isRemoved(id: any): boolean {
    if (id === null) {
      return false;
    }

    let index = this.imageDeleteList.findIndex((imageId) => imageId === id);
    if (index > -1) {
      return true;
    } else return false;
  }

  removeOldFile(id: any) {
    if (id === null) {
      return;
    }

    this.imageDeleteList.push(id);
  }

  undoRemoveOldFile(id: any) {
    if (id === null) {
      return;
    }
    let index = this.imageDeleteList.findIndex((imageId) => imageId === id);
    if (index > -1) {
      this.imageDeleteList.splice(index, 1);
    }
  }

  uploadFile() {
    if (this.filesToUpload.length > 0) {
      this.imageList.forEach((ele) => {
        if (ele.accessSourceId !== "anonymus")
          this.imageDeleteList.push(ele.id ?? "");
      });

      const deletePayload = {
        productType: this.productType,
        fileIdListString: this.imageDeleteList.join(";"),
      };

      this.messageService.openLoadingDialog();

      if (this.imageList[0].accessSourceId !== "anonymus") {
        this.http
          .post("/api/FileDelete", deletePayload)
          .subscribe((res: any) => {
            if (res.messageCode === "I913") {
              const formData = new FormData();

              Array.from(this.filesToUpload).map((file, index) => {
                return formData.append("file" + index, file, file.name);
              });

              formData.append("productId", this.productId ?? "");
              formData.append("productType", this.productType.toString());

              this.http
                .post("/api/FileUpload", formData, {
                  reportProgress: true,
                  observe: "events",
                })
                .pipe(finalize(() => this.reset()))
                .subscribe({
                  next: (event) => {
                    this.messageService.closeLoadingDialog();
                    if (event.type === HttpEventType.UploadProgress)
                      this.progress = Math.round(
                        (100 * event.loaded) / (event.total ?? 100)
                      );
                    else if (event.type === HttpEventType.Response) {
                      this.messageService.openNotifyDialog("Upload thành công");
                      this.urlList = [];
                      this.filesToUpload = [];
                      this.progress = 0;
                      this.getImageList();
                      this.onUploadFinished.emit(event.body);
                    }
                  },
                  error: (err: HttpErrorResponse) => {
                    this.messageService.closeLoadingDialog();
                    console.log(err);
                  },
                });
            } else {
              this.messageService.openNotifyDialog("Upload thất bại");
              this.messageService.closeLoadingDialog();
            }
          });
      } else {
        const formData = new FormData();

        Array.from(this.filesToUpload).map((file, index) => {
          return formData.append("file" + index, file, file.name);
        });

        formData.append("productId", this.productId ?? "");
        formData.append("productType", this.productType.toString());

        this.http
          .post("/api/FileUpload", formData, {
            reportProgress: true,
            observe: "events",
          })
          .pipe(finalize(() => this.reset()))
          .subscribe({
            next: (event) => {
              this.messageService.closeLoadingDialog();
              if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round(
                  (100 * event.loaded) / (event.total ?? 100)
                );
              else if (event.type === HttpEventType.Response) {
                this.messageService.openNotifyDialog("Upload thành công");
                this.urlList = [];
                this.filesToUpload = [];
                this.progress = 0;
                this.getImageList();
                this.onUploadFinished.emit(event.body);
              }
            },
            error: (err: HttpErrorResponse) => {
              this.messageService.closeLoadingDialog();
              console.log(err);
            },
          });
      }
    }
  }

  getImageList() {
    const payload = {
      resourceId: this.productId,
      resourceType: this.productType,
    };

    this.imageList = [];
    this.urlListOld = [];

    return this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((state: any) => {
        this.imageList = state.data ?? [];

        if (this.imageList?.length > 0) {
          this.imageList.forEach((image) => {
            this.urlListOld.push(
              environment.backend.blobURL +
                "/" +
                this.productType +
                "-container/" +
                this.productType.toString() +
                "_" +
                image.id +
                image.fileType
            );
          });
        }
        if (
          state.data == undefined ||
          state.data == null ||
          state.data.length == 0
        ) {
          const anomymousFile: FileModel = {
            id: "anonymus",
            accessSourceId: "anonymus",
            fileType: ".png",
            resourceType: this.productType,
          };
          this.imageList.push(anomymousFile);
        }

        this.imageList = state.data ?? [];
      });
  }

  generateUrl(image: FileModel) {
    return (
      environment.backend.blobURL +
      "/" +
      this.productType +
      "-container/" +
      this.productType.toString() +
      "_" +
      image.id +
      image.fileType
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

    this.reset();
  }

  cancelUpload() {
    if (this.uploadSub) this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    if (this.uploadSub) this.uploadSub.unsubscribe();
  }
}
