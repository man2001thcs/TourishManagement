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
import { PassengerCar, MovingSchedule } from "src/app/model/baseModel";

import moment from "moment";
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

  data_selected_edit: MovingSchedule[] = [];

  movingScheduleList: MovingSchedule[] = [];

  movingScheduleEdit!: MovingSchedule | null;
  indexMovingScheduleEdit: number = -1;

  movingIdList: string[] = [];
  movingNameList: string[] = [];

  data!: PassengerCar[];
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

  movingType = "PassengerCar";

  color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });

  movingFormGroup!: FormGroup;

  editMovingFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;

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
    this.filteredMovings = this.movingCtrl.valueChanges.pipe(
      debounceTime(400)
    );

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
      status: [0, Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],
      vehicleType: [1, Validators.compose([Validators.required])],
      transportId: ["", Validators.compose([Validators.required])],

      startingPlace: ["", Validators.compose([Validators.required])],
      headingPlace: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.editMovingFormGroup = this.fb.group({
      driverName: ["", Validators.compose([Validators.required])],
      vehiclePlate: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      status: [0, Validators.compose([Validators.required])],
      singlePrice: [0, Validators.compose([Validators.required])],
      vehicleType: [1, Validators.compose([Validators.required])],
      transportId: ["", Validators.compose([Validators.required])],

      startingPlace: ["", Validators.compose([Validators.required])],
      headingPlace: ["", Validators.compose([Validators.required])],

      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],

      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
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
              movingType: this.movingType,
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
      MovingListActions.getMovingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
          movingType: this.movingType,
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingListActions.resetMovingList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 0) {
      this.movingType = "PassengerCar";
    } else if (parseInt($event.target.value) === 1) {
      this.movingType = "AirPlane";
    }

    this.movingFormGroup.controls["vehicleType"].setValue(
      parseInt($event.target.value)
    );

    this.movingIdList = [];
    this.movingNameList = [];
    this.movingFormGroup.controls["branchName"].setValue("");

    this.newSearch = true;

    this.store.dispatch(
      MovingListActions.getMovingList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
          movingType: this.movingType
        },
      })
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our moving
    if (value) {
      this.movingNameList.push(value);
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
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    var returnList = this.data_selected_edit.concat(this.movingScheduleList);
    this.result.emit({ data: returnList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.movingNameList.push(event.option.value.branchName);

    console.log(event);

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
    console.log(this.movingFormGroup.value);
    console.log(this.movingFormGroup.valid);
    if (this.movingFormGroup.valid && this.movingFormGroup.dirty) {
      const schedule: MovingSchedule = {
        driverName: this.movingFormGroup.value.driverName,
        branchName: this.movingFormGroup.value.branchName,
        vehiclePlate: this.movingFormGroup.value.vehiclePlate,
        phoneNumber: this.movingFormGroup.value.sphoneNumber,

        transportId: this.movingFormGroup.value.transportId,
        vehicleType: this.movingFormGroup.value.vehicleType,
        status: this.movingFormGroup.value.status,
        startingPlace: this.movingFormGroup.value.startingPlace,
        headingPlace: this.movingFormGroup.value.headingPlace,

        singlePrice: this.movingFormGroup.value.singlePrice,
        startDate: this.movingFormGroup.value.startDate,
        endDate: this.movingFormGroup.value.endDate,
        description: this.movingFormGroup.value.description,
      };

      this.movingScheduleList = [schedule, ...this.movingScheduleList];

      this.movingScheduleList.sort(
        (a: MovingSchedule, b: MovingSchedule) => {
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
      this.movingScheduleEdit = this.data_selected_edit[existIndex];
      this.indexMovingScheduleEdit = existIndex;

      this.editMovingFormGroup.controls["driverName"].setValue(
        this.movingScheduleEdit.driverName
      );
      this.editMovingFormGroup.controls["vehiclePlate"].setValue(
        this.movingScheduleEdit.vehiclePlate
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

      this.editMovingFormGroup.controls["startDate"].setValue(
        this.movingScheduleEdit.startDate
      );
      this.editMovingFormGroup.controls["endDate"].setValue(
        this.movingScheduleEdit.endDate
      );
      this.editMovingFormGroup.controls["description"].setValue(
        this.movingScheduleEdit.description
      );
    }
  }

  editToSchedulesList() {
    if (
      this.indexMovingScheduleEdit > -1 &&
      this.movingScheduleEdit != null
    ) {
      this.data_selected_edit[this.indexMovingScheduleEdit] = {
        driverName: this.editMovingFormGroup.value.driverName,
        branchName: this.editMovingFormGroup.value.branchName,
        vehiclePlate :this.editMovingFormGroup.value.vehiclePlate,
        phoneNumber: this.editMovingFormGroup.value.phoneNumber,

        transportId: this.editMovingFormGroup.value.transportId,
        vehicleType: this.editMovingFormGroup.value.vehicleType,
        singlePrice: this.editMovingFormGroup.value.singlePrice,
        status: this.editMovingFormGroup.value.status,
        startingPlace: this.editMovingFormGroup.value.startingPlace,
        headingPlace: this.editMovingFormGroup.value.headingPlace,

        startDate: this.editMovingFormGroup.value.startDate,
        endDate: this.editMovingFormGroup.value.endDate,
        description: this.editMovingFormGroup.value.description,
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
  }

  removeSchedule(id: string): void {
    var index = this.movingScheduleList.findIndex(
      (entity) => entity.id === id
    );

    if (index > -1) {
      console.log(this.movingScheduleList[index]);
      this.movingScheduleList.splice(index, 1);
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
    this.movingFormGroup.reset({
      driverName: "",
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
          MovingListActions.getMovingList({
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

  onDisplayAtr(moving: PassengerCar): string {
    return "";
  }

  isChecked(moving: PassengerCar): boolean {
    let movingExist = this.movingScheduleList.find(
      (movingSchedule) => movingSchedule.transportId === moving.id
    );
    if (movingExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }

  changeStatus($event: any) {
    this.movingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  changeStatusExist($event: any) {
    this.editMovingFormGroup.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }
}
