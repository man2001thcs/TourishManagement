import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Subscription, of, timer } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { State as EatingListState } from "./multiselect-autocomplete.store.reducer";
import * as EatingListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getEatingList,
  getMessage,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { Restaurant, EatSchedule } from "src/app/model/baseModel";

import moment from "moment";
import { ThemePalette } from "@angular/material/core";
declare let tinymce: any;

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "eating-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class EatingMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  eatingCtrl = new FormControl("");
  @ViewChild("picker") eatingPicker: any;

  @Output() result = new EventEmitter<{ data: Array<EatSchedule> }>();

  @Input() data_selected: Array<EatSchedule> = [];
  @Input() key: string = "";

  tinyMceSetting: any;

  data_selected_edit: EatSchedule[] = [];

  eatingScheduleList: EatSchedule[] = [];

  eatingScheduleEdit: EatSchedule | null = null;
  indexEatScheduleEdit: number = -1;

  eatingIdList: string[] = [];
  eatingNameList: string[] = [];

  data!: Restaurant[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  editorContent = "";

  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  eatingType = "Restaurant";

  color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });

  eatingFormGroup!: FormGroup;

  editEatingFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;

  subscriptions: Subscription[] = [];
  eatingListState!: Observable<any>;
  filteredEatings!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("eatingInput") eatingInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<EatingListState>,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.filteredEatings = this.eatingCtrl.valueChanges.pipe(debounceTime(200));

    this.eatingListState = this.store
      .select(getEatingList)
      .pipe(debounceTime(200));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.data_selected_edit = [...this.data_selected];

    this.eatingFormGroup = this.fb.group({
      placeName: ["", Validators.compose([Validators.required])],

      address: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],

      status: [0, Validators.compose([Validators.required])],
      restaurantId: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.editEatingFormGroup = this.fb.group({
      placeName: ["", Validators.compose([Validators.required])],

      address: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],

      status: [0, Validators.compose([Validators.required])],
      restaurantId: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.subscriptions.push(
      this.filteredEatings.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          EatingListActions.getEatingList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.eatingListState.subscribe((state) => {
        if (state) {
          if (state.data)
            this.currentTotal = this.currentTotal + state.data.length;
          if (this.currentTotal >= state.count) this.canLoadMore = false;

          // New search
          if (this.newSearch || this.currentTotal === state.data.length) {
            if (state.data) this.data = state.data;
            this.newSearch = false;
          } else {
            if (state.data) this.data = this.data.concat(state.data);
          }

          this.length = state.count;
        }

        this.cancelLoading();
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      EatingListActions.getEatingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
          eatingType: this.eatingType,
        },
      })
    );

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
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(EatingListActions.resetEatingList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our eating
    if (value) {
      this.eatingNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.eatingCtrl.setValue(null);
  }

  remove(eating: string): void {
    const index = this.eatingNameList.indexOf(eating);
    if (index >= 0) {
      this.eatingNameList.splice(index, 1);
      this.eatingIdList.splice(index, 1);
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    var returnList = this.data_selected_edit.concat(this.eatingScheduleList);
    this.result.emit({ data: returnList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.eatingIdList.push(event.option.value.id);
    this.eatingNameList.push(event.option.value.placeBranch);

    this.eatingFormGroup.controls["restaurantId"].setValue(
      event.option.value.id
    );

    this.eatingFormGroup.controls["placeName"].setValue(
      event.option.value.placeBranch
    );
    this.eatingFormGroup.controls["address"].setValue(
      event.option.value.headQuarterAddress
    );
    this.eatingFormGroup.controls["supportNumber"].setValue(
      event.option.value.hotlineNumber
    );

    this.eatingInput.nativeElement.value = "";
    this.eatingCtrl.setValue(null);
  }

  addToSchedule(): void {
    this.isSubmit = true;

    this.eatingFormGroup.controls["description"].setValue(
      this.editorContent
    );

    if (this.eatingFormGroup.valid && this.eatingFormGroup.dirty) {
      const schedule: EatSchedule = {
        placeName: this.eatingFormGroup.value.placeName,
        address: this.eatingFormGroup.value.address,
        status: this.eatingFormGroup.value.status,
        supportNumber: this.eatingFormGroup.value.supportNumber,
        restaurantId: this.eatingFormGroup.value.restaurantId,
        singlePrice: this.eatingFormGroup.value.singlePrice,
        startDate: this.eatingFormGroup.value.startDate,
        endDate: this.eatingFormGroup.value.endDate,
        description: this.editorContent,
      };

      this.eatingScheduleList = [schedule, ...this.eatingScheduleList];

      this.eatingScheduleList.sort((a: EatSchedule, b: EatSchedule) => {
        return moment(a.startDate).valueOf() - moment(b.startDate).valueOf();
      });

      this.editorContent = "";

      this.emitAdjustedData();
      this.formReset();
    }
  }

  clickEditSchedule(id: string): void {
    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    if (existIndex > -1) {
      this.eatingScheduleEdit = this.data_selected_edit[existIndex];
      this.indexEatScheduleEdit = existIndex;

      this.editEatingFormGroup.controls["status"].setValue(
        this.eatingScheduleEdit.status
      );
      this.editEatingFormGroup.controls["placeName"].setValue(
        this.eatingScheduleEdit.placeName
      );
      this.editEatingFormGroup.controls["address"].setValue(
        this.eatingScheduleEdit.address
      );
      this.editEatingFormGroup.controls["supportNumber"].setValue(
        this.eatingScheduleEdit.supportNumber
      );
      this.editEatingFormGroup.controls["restaurantId"].setValue(
        this.eatingScheduleEdit.restaurantId
      );
      this.editEatingFormGroup.controls["singlePrice"].setValue(
        this.eatingScheduleEdit.singlePrice
      );
      this.editEatingFormGroup.controls["startDate"].setValue(
        this.eatingScheduleEdit.startDate
      );
      this.editEatingFormGroup.controls["endDate"].setValue(
        this.eatingScheduleEdit.endDate
      );
      this.editEatingFormGroup.controls["description"].setValue(
        this.eatingScheduleEdit.description
      );

      this.editorContent = this.eatingScheduleEdit.description;
    }
  }

  editToSchedulesList() {
    if (this.indexEatScheduleEdit > -1 && this.eatingScheduleEdit != null) {
      this.data_selected_edit[this.indexEatScheduleEdit] = {
        placeName: this.editEatingFormGroup.value.placeName,
        address: this.editEatingFormGroup.value.address,
        supportNumber: this.editEatingFormGroup.value.supportNumber,
        restaurantId: this.editEatingFormGroup.value.restaurantId,
        singlePrice: this.editEatingFormGroup.value.singlePrice,
        status: this.editEatingFormGroup.value.status,
        startDate: this.editEatingFormGroup.value.startDate,
        endDate: this.editEatingFormGroup.value.endDate,
        description: this.editorContent,
      };

      this.messageService
        .openNotifyDialog("Thay đổi thành công")
        .subscribe(() => {
          this.cancelEditSchedule();
          this.emitAdjustedData();
        });
    }
  }

  cancelEditSchedule(): void {
    this.eatingScheduleEdit = null;
    this.indexEatScheduleEdit = -1;
  }

  removeSchedule(id: string): void {
    var index = this.eatingScheduleList.findIndex((entity) => entity.id === id);

    if (index > -1) {
      console.log(this.eatingScheduleList[index]);
      this.eatingScheduleList.splice(index, 1);
    }

    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    console.log(existIndex);
    if (existIndex > -1) {
      console.log(this.data_selected_edit[existIndex]);
      this.data_selected_edit.splice(existIndex, 1);
    }

    this.emitAdjustedData();
  }

  formReset(): void {
    this.eatingFormGroup.reset({
      placeName: "",
      description: "",
      address: "",
      supportNumber: "",
      restHouseBranchId: "",
      restHouseType: 1,
      singlePrice: 0,
      startDate: "",
      endDate: "",
    });

    this.isSubmit = false;
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          EatingListActions.getEatingList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              pageSize: 6,
            },
          })
        );
      }
    }
  }

  changeStatus($event: any) {
    this.eatingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  changeStatusExist($event: any) {
    this.editEatingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  onDisplayAtr(eating: Restaurant): string {
    return "";
  }

  isChecked(eating: Restaurant): boolean {
    let eatingExist = this.eatingScheduleList.find(
      (eatingSchedule) => eatingSchedule.restaurantId === eating.id
    );
    if (eatingExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }

  outTest(input: any){
    console.log(input);
  }
}
