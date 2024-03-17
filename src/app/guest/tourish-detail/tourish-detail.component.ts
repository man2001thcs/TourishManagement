import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { SaveFile, TourishPlan } from "src/app/model/baseModel";
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

  tinyMceSetting!: any;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.tourishPlanId = this._route.snapshot.paramMap.get("id") ?? "";

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
      base_url: "/tinymce", // Root for resources
      suffix: ".min", // Suffix to use when loading resources
      toolbar: false, // hide the toolbar
      menubar: false, // hide the menu bar
      statusbar: false, // hide the status bar
      readonly: true, // make it read-only

      setup: function (editor: any) {
        editor.on("BeforeSetContent", function (e: any) {
          if (editor.readonly) {
            e.preventDefault(); // Prevent content from being set
          }
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

      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    };
  }

  slides: any[] = [];

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
            "https://bookstore1storage.blob.core.windows.net/1-container/" +
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
}
