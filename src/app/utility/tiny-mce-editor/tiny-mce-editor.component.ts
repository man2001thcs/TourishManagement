import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
declare let tinymce: any;

@Component({
  selector: "app-tiny-mce-editor",
  templateUrl: "./tiny-mce-editor.component.html",
  styleUrls: ["./tiny-mce-editor.component.css"],
})
export class TinyMceEditorComponent implements OnInit {
  @Input()
  containerName = "";
  @Input()
  blobName = "";

  @Output() result = new EventEmitter<{
    data: string;
  }>();

  tinyMceSetting: any;
  editorContent = "";

  color: ThemePalette = "primary";

  constructor(private http: HttpClient) {}

  ngOnInit() {
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

    this.getDescription();
  }

  private getDescription() {
    if (this.blobName.length > 0) {
      const payload = {
        containerName: this.containerName,
        blobName: this.blobName,
      };

      this.http
        .get("/api/GetTourishPlanDescription", { params: payload })
        .subscribe((state: any) => {
          if (state) {
            console.log("abc: ", state);
            this.editorContent = state.data;
            this.emitAdjustedData();

          }
        });
    }
  }

  emitAdjustedData = (): void => {
    this.result.emit({ data: this.editorContent });
  };
}
