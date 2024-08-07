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

import { State as MovingListState } from "./multiselect-autocomplete.store.reducer";
import * as MovingListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMovingList,
  getMessage,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { MovingContact, MovingSchedule } from "src/app/model/baseModel";
import { ThemePalette } from "@angular/material/core";
/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "moving-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class MovingMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingCtrl = new FormControl("");
  @ViewChild("picker") movingPicker: any;

  @Output() result = new EventEmitter<{ data: Array<MovingSchedule> }>();

  @Input() data_selected: Array<MovingSchedule> = [];
  @Input() key: string = "";
  @Input() createFormOpen = false;
  editorContent = "";

  data_selected_edit: MovingSchedule[] = [];

  movingScheduleList: MovingSchedule[] = [];

  movingScheduleEdit: MovingSchedule | null = null;
  indexMovingScheduleEdit: number = -1;

  movingIdList: string[] = [];
  movingNameList: string[] = [];

  data!: MovingContact[];
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

  vehicleType = 0;

  color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });

  movingFormGroup!: FormGroup;

  editMovingFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;
  @Input() disabled: boolean = false;

  subscriptions: Subscription[] = [];
  movingListState!: Observable<any>;
  filteredMovings!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("movingInput") movingInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<MovingListState>,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.filteredMovings = this.movingCtrl.valueChanges.pipe(debounceTime(400));

    this.movingListState = this.store
      .select(getMovingList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.data_selected_edit = [...this.data_selected];

    this.movingFormGroup = this.fb.group({
      driverName: ["", Validators.compose([Validators.required])],
      vehiclePlate: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],
      vehicleType: [0, Validators.compose([Validators.required])],
      transportId: ["", Validators.compose([Validators.required])],

      startingPlace: ["", Validators.compose([Validators.required])],
      headingPlace: ["", Validators.compose([Validators.required])],

      description: [""],
    });

    this.editMovingFormGroup = this.fb.group({
      driverName: ["", Validators.compose([Validators.required])],
      vehiclePlate: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],
      vehicleType: [0, Validators.compose([Validators.required])],
      transportId: ["", Validators.compose([Validators.required])],

      startingPlace: ["", Validators.compose([Validators.required])],
      headingPlace: ["", Validators.compose([Validators.required])],

      description: [""],
    });

    this.subscriptions.push(
      this.filteredMovings.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          MovingListActions.getMovingList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              pageSize: 6,
              type: this.vehicleType,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.movingListState.subscribe((state) => {
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
      this.errorMessageState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state.code);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.store.dispatch(
      MovingListActions.getMovingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.vehicleType,
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(MovingListActions.resetMovingList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 0) {
      this.vehicleType = 0;
    } else if (parseInt($event.target.value) === 1) {
      this.vehicleType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.vehicleType = 2;
    } else if (parseInt($event.target.value) === 3) {
      this.vehicleType = 3;
    } else if (parseInt($event.target.value) === 4) {
      this.vehicleType = 4;
    }

    this.movingFormGroup.controls["vehicleType"].setValue(
      parseInt($event.target.value)
    );

    this.editMovingFormGroup.controls["vehicleType"].setValue(
      parseInt($event.target.value)
    );

    this.movingIdList = [];
    this.movingNameList = [];
    this.movingFormGroup.controls["branchName"].setValue("");

    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      MovingListActions.getMovingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.vehicleType,
        },
      })
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our moving
    if (value) {
      this.movingNameList.push(value);
      this.createFormOpen = true;
    }

    // Clear the input value
    event.chipInput!.clear();

    this.movingCtrl.setValue(null);
  }

  remove(moving: string): void {
    const index = this.movingNameList.indexOf(moving);
    if (index >= 0) {
      this.movingNameList.splice(index, 1);
      this.movingIdList.splice(index, 1);
      this.createFormOpen = false;
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.movingNameList = [];
    this.movingIdList = [];
    var returnList = this.data_selected_edit.concat(this.movingScheduleList);
    this.result.emit({ data: returnList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.movingNameList.push(event.option.value.branchName);

    this.movingFormGroup.controls["transportId"].setValue(
      event.option.value.id
    );
    this.movingFormGroup.controls["branchName"].setValue(
      event.option.value.branchName
    );
    this.movingFormGroup.controls["phoneNumber"].setValue(
      event.option.value.hotlineNumber
    );

    this.movingInput.nativeElement.value = "";
    this.movingCtrl.setValue(null);
  }

  addToSchedule(): void {
    this.isSubmit = true;

    this.movingFormGroup.controls["description"].setValue(this.editorContent);

    if (this.movingFormGroup.valid && this.movingFormGroup.dirty) {
      const schedule: MovingSchedule = {
        driverName: this.movingFormGroup.value.driverName,
        branchName: this.movingFormGroup.value.branchName,
        vehiclePlate: this.movingFormGroup.value.vehiclePlate,
        phoneNumber: this.movingFormGroup.value.phoneNumber,

        transportId: this.movingFormGroup.value.transportId,
        vehicleType: this.movingFormGroup.value.vehicleType,
        startingPlace: this.movingFormGroup.value.startingPlace,
        headingPlace: this.movingFormGroup.value.headingPlace,

        singlePrice: this.movingFormGroup.value.singlePrice,
        description: this.editorContent,
      };

      this.movingScheduleList = [schedule, ...this.movingScheduleList];

      this.editorContent = "";
      this.emitAdjustedData();
      this.formReset();
    }
  }

  clickEditSchedule(id: string): void {
    this.movingNameList = [];
    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    if (existIndex > -1) {
      this.movingScheduleEdit = this.data_selected_edit[existIndex];
      this.indexMovingScheduleEdit = existIndex;
      this.editorContent = this.movingScheduleEdit.description;

      this.editMovingFormGroup.controls["driverName"].setValue(
        this.movingScheduleEdit.driverName
      );
      this.editMovingFormGroup.controls["vehiclePlate"].setValue(
        this.movingScheduleEdit.vehiclePlate
      );
      this.editMovingFormGroup.controls["branchName"].setValue(
        this.movingScheduleEdit.branchName
      );

      this.editMovingFormGroup.controls["phoneNumber"].setValue(
        this.movingScheduleEdit.phoneNumber
      );
      this.editMovingFormGroup.controls["vehicleType"].setValue(
        this.movingScheduleEdit.vehicleType
      );
      this.editMovingFormGroup.controls["transportId"].setValue(
        this.movingScheduleEdit.transportId
      );
      this.editMovingFormGroup.controls["singlePrice"].setValue(
        this.movingScheduleEdit.singlePrice
      );

      this.editMovingFormGroup.controls["startingPlace"].setValue(
        this.movingScheduleEdit.startingPlace
      );
      this.editMovingFormGroup.controls["headingPlace"].setValue(
        this.movingScheduleEdit.headingPlace
      );
      this.editMovingFormGroup.controls["description"].setValue(
        this.movingScheduleEdit.description
      );
    }
  }

  editToSchedulesList() {
    if (this.indexMovingScheduleEdit > -1 && this.movingScheduleEdit != null) {
      this.data_selected_edit[this.indexMovingScheduleEdit] = {
        id: this.movingScheduleEdit.id,
        driverName: this.editMovingFormGroup.value.driverName,
        branchName: this.editMovingFormGroup.value.branchName,
        vehiclePlate: this.editMovingFormGroup.value.vehiclePlate,
        phoneNumber: this.editMovingFormGroup.value.phoneNumber,

        transportId: this.editMovingFormGroup.value.transportId,
        vehicleType: this.editMovingFormGroup.value.vehicleType,
        singlePrice: this.editMovingFormGroup.value.singlePrice,
        startingPlace: this.editMovingFormGroup.value.startingPlace,
        headingPlace: this.editMovingFormGroup.value.headingPlace,
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
    this.movingScheduleEdit = null;
    this.indexMovingScheduleEdit = -1;
    this.editorContent = "";
  }

  removeSchedule(id: string): void {
    var index = this.movingScheduleList.findIndex((entity) => entity.id === id);

    if (index > -1) {
      this.movingScheduleList.splice(index, 1);
    }

    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );

    if (existIndex > -1) {
      this.data_selected_edit.splice(existIndex, 1);
    }

    this.emitAdjustedData();
  }

  formReset(): void {
    this.movingFormGroup.reset({
      driverName: "",
      description: "",
      address: "",
      supportNumber: "",
      restHouseBranchId: "",
      restHouseType: 1,
      singlePrice: 0,
    });

    this.isSubmit = false;
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          MovingListActions.getMovingList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              pageSize: this.pageSize,
              type: this.vehicleType,
            },
          })
        );
      }
    }
  }

  onDisplayAtr(moving: MovingContact): string {
    return "";
  }

  onDisplayName(input: string): string {
    if (input.length > 30) return input.substring(0, 30) + "...";
    else return input;
  }

  isChecked(moving: MovingContact): boolean {
    let movingExist = this.movingScheduleList.find(
      (movingSchedule) => movingSchedule.transportId === moving.id
    );
    if (movingExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }

  getScheduleEditId(): string {
    if (this.movingScheduleEdit !== null) {
      return this.movingScheduleEdit.id ?? "";
    }
    return "";
  }

  getTinyMceResult($event: any) {
    this.editorContent = $event.data;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
}
