import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { SaveFile, TourishPlan } from "src/app/model/baseModel";
import { MessageService } from "src/app/utility/user_service/message.service";
import { environment } from "src/environments/environment";
declare let tinymce: any;

@Component({
  selector: "app-tourish-detail",
  templateUrl: "./tourish-detail.component.html",
  styleUrls: ["./tourish-detail.component.css"],
})
export class TourishDetailComponent implements OnInit {
  @Input()
  data!: string;

  active = 1;

  setTourForm!: FormGroup;

  isSubmit = false;
  tourishPlanId = "";
  tourDescription = "";

  tourishPlan?: TourishPlan;
  tourImage: SaveFile[] = [];

  @ViewChild(EditorComponent) editor!: EditorComponent;

  tinyMceSetting!: any;
  ratingAverage = 3;
  ratingArr:number[] = [];

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private rendered2: Renderer2,
    private messageService: MessageService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.tourishPlanId = this._route.snapshot.paramMap.get("id") ?? "";

    for (let index = 0; index < 5; index++) {
      this.ratingArr.push(index);
    }

    this.getRatingForTour();

    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.getTourImage();
    this.getTour();

    // var result = tinymce.editors;
    // result.forEach((element: any) => {
    //   tinymce.get(element.id).getBody().setAttribute("contenteditable", false);
    //   tinymce.get(element.id).getBody().style.backgroundColor = "#ecf0f5";
    // });

    this.tinyMceSetting = {
      base_url: "/tinymce",
      suffix: ".min",
      toolbar: false,
      menubar: false,
      statusbar: false,

      readonly: 1,

      setup: (editor: any) => {
        editor.on("init", () => {
          // Get content from TinyMCE and append it to the specified div
          editor.getBody().setAttribute("contenteditable", "false");
        });
      },

      plugins: [
        "autoresize",
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
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
        "code",
        "help",
        "wordcount",
        "table",
        "codesample",
      ],
      // eslint-disable-next-line
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

      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    };

    // tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
  }

  slides: any[] = [];

  getSanitizedContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getTour() {
    this.http
      .get("/api/GetTourishPlan/" + this.tourishPlanId)
      .subscribe((response: any) => {
        this.tourishPlan = response.data;

        this.tourDescription = this.tourishPlan?.description ?? "";
        console.log(response);
      });
  }

  getTourImage() {
    const payload = {
      resourceId: this.tourishPlanId,
      resourceType: 1,
    };

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((response: any) => {
        this.tourImage = response.data;

        if (this.tourImage.length > 0) {
          this.pushImageToList();
        }

        console.log(response);
      });
  }

  pushImageToList() {
    let index = 0;
    this.tourImage.forEach((saveFile) => {
      index++;
      this.slides = [
        ...this.slides,
        {
          url:
            environment.backend.blobURL +
            "/1-container/" +
            "1" +
            "_" +
            saveFile.id +
            saveFile.fileType,
          title: "slide: " + index,
          description: "This is the slide " + index,
        },
      ];
    });
  }

  getTotalPrice(): number {
    let totalPrice = 0;

    if (this.tourishPlan) {
      this.tourishPlan.stayingSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });

      this.tourishPlan.eatSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });

      this.tourishPlan.movingSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });
    }

    return totalPrice;
  }

  register() {
    const payload = {
      guestName: this.setTourForm.value.name,
      guestEmail: this.setTourForm.value.email,
      guestPhoneNumber: this.setTourForm.value.phoneNumber,
      totalTicket: this.setTourForm.value.totalTicket,
    };

    this.messageService.openLoadingDialog();
    this.http
      .post("/api/AddReceipt/client", payload)
      .subscribe((response: any) => {
        if (response) {
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(response.messageCode);
        }
      });
  }

  getRatingForTour() {
    const payload = {
      tourishPlanId: this.tourishPlanId,
    };

    this.http
      .get("/api/GetTourRating/tourishplan", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          console.log("abc", state);
          this.ratingAverage = state.averagePoint;
        }
      });
  }

  showIcon(index: number) {
    if (this.ratingAverage >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }

}
