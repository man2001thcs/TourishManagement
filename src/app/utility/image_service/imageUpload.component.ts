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
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Observable, Subscription, catchError, finalize } from "rxjs";
import { MessageService } from "../user_service/message.service";

import { State as ImageUploadState } from "./imageUpload.store.reducer";
import {
  getImageList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./imageUpload.store.selector";
import * as ImageListActions from "./imageUpload.store.action";
import { Store } from "@ngrx/store";
import { FileModel } from "./imageUpload.component.model";

@Component({
  selector: "app-file-upload",
  templateUrl: "imageUpload.component.html",
  styleUrls: ["imageUpload.component.css"],
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @Input()
  productId?: string;

  @Input()
  productType: number = 1;

  @Input()
  requiredFileType?: string;
  @Output() public onUploadFinished = new EventEmitter();

  @ViewChild('file') fileInputRef!: ElementRef;

  fileName = "";
  uploadProgress?: number;
  uploadSub!: Subscription;

  imageList!: FileModel[];
  subscriptions: Subscription[] = [];

  filesToUpload: File[] = [];

  urlList: string[] = [];
  urlListOld: string[] = [];

  imageDeleteList: string[] = [];

  progress = 0;
  total = 100;

  imageUploadState!: Observable<any>;
  imageDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private store: Store<ImageUploadState>
  ) {
    this.imageUploadState = this.store.select(getImageList);
    this.imageDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.imageUploadState.subscribe((state) => {
        if (state) {
          this.imageList = state.data;

          if (this.imageList?.length > 0) {
            this.imageList.forEach((image) => {
              this.urlListOld.push(
                "https://bookstore1storage.blob.core.windows.net/1-container/" +
                  this.productType.toString() +
                  "_" +
                  image.id +
                  image.fileType
              );
            });
          }
        }
      })
    );

    this.subscriptions.push(
      this.imageDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              ImageListActions.getImageList({
                payload: {
                  resourceId: this.productId,
                  resourceType: this.productType,
                },
              })
            );
          }
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.openMessageNotifyDialog(state);
          }
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.store.dispatch(ImageListActions.initial());

    this.store.dispatch(
      ImageListActions.getImageList({
        payload: {
          resourceId: this.productId,
          resourceType: this.productType,
        },
      })
    );
  }

  changeFile(files: any) {
    console.log(files);

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
        console.log(this.filesToUpload);
      }
    };
  }

  removeFile(index: any) {
    if (index === null) {
      return;
    }

    this.urlList.splice(index, 1);
    this.filesToUpload.splice(index, 1);

    this.fileInputRef.nativeElement.value = '';
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
    console.log("id: " + id);
    if (id === null) {
      return;
    }

    this.imageDeleteList.push(id);
    console.log(this.imageDeleteList);
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
    if (this.imageDeleteList.length > 0) {
      let fileListString = this.imageDeleteList.join(";");

      const payload = {
        productType: 1,
        fileIdListString: fileListString.toString(),
      };

      console.log(payload);

      this.store.dispatch(
        ImageListActions.deleteImage({
          payload: payload,
        })
      );
    }

    if (this.filesToUpload.length > 0) {
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
            if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(
                (100 * event.loaded) / (event.total ?? 100)
              );
            else if (event.type === HttpEventType.Response) {
              this.messageService.openNotifyDialog("Upload thành công");
              this.onUploadFinished.emit(event.body);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err),
        });
    }
  }

  generateUrl(image: FileModel) {
    return (
      "https://bookstore1storage.blob.core.windows.net/1-container/" +
      this.productType.toString() +
      "_" +
      image.id +
      image.fileType
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(ImageListActions.resetImageList());

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
