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

import { State as StayingListState } from "./multiselect-autocomplete.store.reducer";
import * as StayingListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getStayingList,
  getMessage,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { Hotel, StayingSchedule } from "src/app/model/baseModel";

import moment from "moment";
import { ThemePalette } from "@angular/material/core";
declare let tinymce: any;

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "staying-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class StayingMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  stayingCtrl = new FormControl("");
  @ViewChild("picker") stayingPicker: any;

  @Output() result = new EventEmitter<{ data: Array<StayingSchedule> }>();

  @Input() data_selected: Array<StayingSchedule> = [];
  @Input() key: string = "";
  tinyMceSetting: any;
  editorContent = "";
  
  data_selected_edit: StayingSchedule[] = [];

  stayingScheduleList: StayingSchedule[] = [];

  stayingScheduleEdit!: StayingSchedule | null;
  indexStayingScheduleEdit: number = -1;

  stayingIdList: string[] = [];
  stayingNameList: string[] = [];

  data!: Hotel[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  stayingType = "Hotel";

  color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });

  stayingFormGroup!: FormGroup;

  editStayingFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;

  subscriptions: Subscription[] = [];
  stayingListState!: Observable<any>;
  filteredStayings!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("stayingInput") stayingInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<StayingListState>,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.filteredStayings = this.stayingCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.stayingListState = this.store
      .select(getStayingList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.data_selected_edit = [...this.data_selected];

    this.stayingFormGroup = this.fb.group({
      placeName: ["", Validators.compose([Validators.required])],

      address: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],

      status: [0, Validators.compose([Validators.required])],
      restHouseType: [1, Validators.compose([Validators.required])],
      restHouseBranchId: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.editStayingFormGroup = this.fb.group({
      placeName: ["", Validators.compose([Validators.required])],

      address: ["", Validators.compose([Validators.required])],
      supportNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],
      status: [0, Validators.compose([Validators.required])],
      restHouseType: [1, Validators.compose([Validators.required])],
      restHouseBranchId: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.subscriptions.push(
      this.filteredStayings.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          StayingListActions.getStayingList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              pageSize: 6,
              stayingType: this.stayingType,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.stayingListState.subscribe((state) => {
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
      StayingListActions.getStayingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
          stayingType: this.stayingType,
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(StayingListActions.resetStayingList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  changeType($event: any) {
    console.log($event.target.value);

    if (parseInt($event.target.value) === 1) {
      this.stayingType = "Hotel";
    } else if (parseInt($event.target.value) === 0) {
      this.stayingType = "HomeStay";
    }

    this.stayingFormGroup.controls["restHouseType"].setValue(
      parseInt($event.target.value)
    );

    this.stayingIdList = [];
    this.stayingNameList = [];
    this.stayingFormGroup.controls["placeName"].setValue("");

    this.newSearch = true;

    this.store.dispatch(
      StayingListActions.getStayingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
        },
      })
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our staying
    if (value) {
      this.stayingNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.stayingCtrl.setValue(null);
  }

  remove(staying: string): void {
    const index = this.stayingNameList.indexOf(staying);
    if (index >= 0) {
      this.stayingNameList.splice(index, 1);
      this.stayingIdList.splice(index, 1);
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    var returnList = this.data_selected_edit.concat(this.stayingScheduleList);
    this.result.emit({ data: returnList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.stayingIdList.push(event.option.value.id);
    this.stayingNameList.push(event.option.value.placeBranch);

    this.stayingFormGroup.controls["restHouseBranchId"].setValue(
      event.option.value.id
    );
    this.stayingFormGroup.controls["placeName"].setValue(
      event.option.value.placeBranch
    );
    this.stayingFormGroup.controls["address"].setValue(
      event.option.value.headQuarterAddress
    );
    this.stayingFormGroup.controls["supportNumber"].setValue(
      event.option.value.hotlineNumber
    );

    this.stayingInput.nativeElement.value = "";
    this.stayingCtrl.setValue(null);
  }

  addToSchedule(): void {
    this.isSubmit = true;
    console.log(this.stayingFormGroup.value);
    console.log(this.stayingFormGroup.valid);
    if (this.stayingFormGroup.valid && this.stayingFormGroup.dirty) {
      const schedule: StayingSchedule = {
        placeName: this.stayingFormGroup.value.placeName,
        address: this.stayingFormGroup.value.address,
        supportNumber: this.stayingFormGroup.value.supportNumber,
        restHouseBranchId: this.stayingFormGroup.value.restHouseBranchId,
        status: this.stayingFormGroup.value.status,
        restHouseType: this.stayingFormGroup.value.restHouseType,
        singlePrice: this.stayingFormGroup.value.singlePrice,
        startDate: this.stayingFormGroup.value.startDate,
        endDate: this.stayingFormGroup.value.endDate,
        description: this.stayingFormGroup.value.description,
      };

      this.stayingScheduleList = [schedule, ...this.stayingScheduleList];

      this.stayingScheduleList.sort(
        (a: StayingSchedule, b: StayingSchedule) => {
          return moment(a.startDate).valueOf() - moment(b.startDate).valueOf();
        }
      );

      this.emitAdjustedData();
      this.formReset();
    }
  }

  clickEditSchedule(id: string): void {
    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    if (existIndex > -1) {
      this.stayingScheduleEdit = this.data_selected_edit[existIndex];
      this.indexStayingScheduleEdit = existIndex;

      this.editStayingFormGroup.controls["placeName"].setValue(
        this.stayingScheduleEdit.placeName
      );
      this.editStayingFormGroup.controls["address"].setValue(
        this.stayingScheduleEdit.address
      );
      this.editStayingFormGroup.controls["supportNumber"].setValue(
        this.stayingScheduleEdit.supportNumber
      );
      this.editStayingFormGroup.controls["restHouseBranchId"].setValue(
        this.stayingScheduleEdit.restHouseBranchId
      );
      this.editStayingFormGroup.controls["restHouseType"].setValue(
        this.stayingScheduleEdit.restHouseType
      );
      this.editStayingFormGroup.controls["singlePrice"].setValue(
        this.stayingScheduleEdit.singlePrice
      );
      this.editStayingFormGroup.controls["startDate"].setValue(
        this.stayingScheduleEdit.startDate
      );
      this.editStayingFormGroup.controls["endDate"].setValue(
        this.stayingScheduleEdit.endDate
      );
      this.editStayingFormGroup.controls["description"].setValue(
        this.stayingScheduleEdit.description
      );
    }
  }

  editToSchedulesList() {
    if (
      this.indexStayingScheduleEdit > -1 &&
      this.stayingScheduleEdit != null
    ) {
      this.data_selected_edit[this.indexStayingScheduleEdit] = {
        placeName: this.editStayingFormGroup.value.placeName,
        address: this.editStayingFormGroup.value.address,
        supportNumber: this.editStayingFormGroup.value.supportNumber,
        restHouseBranchId: this.editStayingFormGroup.value.restHouseBranchId,
        restHouseType: this.editStayingFormGroup.value.restHouseType,
        status: this.editStayingFormGroup.value.status,
        singlePrice: this.editStayingFormGroup.value.singlePrice,
        startDate: this.editStayingFormGroup.value.startDate,
        endDate: this.editStayingFormGroup.value.endDate,
        description: this.editStayingFormGroup.value.description,
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
    this.stayingScheduleEdit = null;
    this.indexStayingScheduleEdit = -1;
  }

  removeSchedule(id: string): void {
    var index = this.stayingScheduleList.findIndex(
      (entity) => entity.id === id
    );

    if (index > -1) {
      console.log(this.stayingScheduleList[index]);
      this.stayingScheduleList.splice(index, 1);
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
    this.stayingFormGroup.reset({
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
          StayingListActions.getStayingList({
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

  onDisplayAtr(staying: Hotel): string {
    return "";
  }

  isChecked(staying: Hotel): boolean {
    let stayingExist = this.stayingScheduleList.find(
      (stayingSchedule) => stayingSchedule.restHouseBranchId === staying.id
    );
    if (stayingExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }

  changeStatus($event: any) {
    this.stayingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  changeStatusExist($event: any) {
    this.editStayingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }
}
