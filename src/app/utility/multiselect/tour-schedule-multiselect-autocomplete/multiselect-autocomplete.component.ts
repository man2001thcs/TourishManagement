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

import { Store } from "@ngrx/store";

import { MessageService } from "../../user_service/message.service";
import { MovingContact, TourishSchedule } from "src/app/model/baseModel";

import moment from "moment";
import { ThemePalette } from "@angular/material/core";
import { faL } from "@fortawesome/free-solid-svg-icons";
/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "schedule-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class TourScheduleMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingCtrl = new FormControl("");
  @ViewChild("picker") movingPicker: any;

  @Output() result = new EventEmitter<{ data: Array<TourishSchedule> }>();

  @Input() tourishPlanId: string = "";
  @Input() data_selected: Array<TourishSchedule> = [];
  @Input() key: string = "";
  @Input() createFormOpen = false;

  data_selected_edit: TourishSchedule[] = [];
  scheduleList: TourishSchedule[] = [];


  scheduleEdit: TourishSchedule | null = null;
  indexTourishScheduleEdit: number = -1;

  scheduleIdList: string[] = [];
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

  isNewEdited = false;

  color: ThemePalette = "primary";

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });

  scheduleFormGroup!: FormGroup;

  editScheduleFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;
  @Input() disabled: boolean = false;

  @ViewChild("movingInput") movingInput!: ElementRef<HTMLInputElement>;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.data_selected_edit = [...this.data_selected];

    this.scheduleFormGroup = this.fb.group({
      planStatus: [0, Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
    });

    this.editScheduleFormGroup = this.fb.group({
      planStatus: [0, Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      createDate: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
  }

  remove(id: string): void {
    const index = this.scheduleIdList.indexOf(id);
    if (index >= 0) {
      this.scheduleIdList.splice(index, 1);
      this.createFormOpen = false;
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    var returnList = this.data_selected_edit.concat(this.scheduleList);
    this.result.emit({ data: returnList });
  };

  addToSchedule(): void {
    this.isSubmit = true;

    if (this.scheduleFormGroup.valid && this.scheduleFormGroup.dirty) {
      const schedule: TourishSchedule = {
        tourishPlanId: this.tourishPlanId,
        startDate: this.scheduleFormGroup.value.startDate,
        endDate: this.scheduleFormGroup.value.endDate,
        planStatus: parseInt(this.scheduleFormGroup.value.planStatus),
      };

      this.scheduleList = [schedule, ...this.scheduleList];

      this.scheduleList.sort((a: TourishSchedule, b: TourishSchedule) => {
        return moment(a.startDate).valueOf() - moment(b.startDate).valueOf();
      });

      this.emitAdjustedData();
      this.formReset();
    }
  }

  clickEditSchedule(id: string): void {
    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    if (existIndex > -1) {
      this.scheduleEdit = this.data_selected_edit[existIndex];
      this.indexTourishScheduleEdit = existIndex;

      this.editScheduleFormGroup.controls["startDate"].setValue(
        this.scheduleEdit.startDate
      );
      this.editScheduleFormGroup.controls["endDate"].setValue(
        this.scheduleEdit.endDate
      );
      this.editScheduleFormGroup.controls["planStatus"].setValue(
        this.scheduleEdit.planStatus
      );
      this.editScheduleFormGroup.controls["createDate"].setValue(
        this.scheduleEdit.createDate
      );
    }
  }

  editToSchedulesList() {
    if (this.indexTourishScheduleEdit > -1 && this.scheduleEdit != null) {
      this.data_selected_edit[this.indexTourishScheduleEdit] = {
        id: this.scheduleEdit.id,
        tourishPlanId: this.scheduleEdit.tourishPlanId,
        startDate: this.editScheduleFormGroup.value.startDate,
        endDate: this.editScheduleFormGroup.value.endDate,
        planStatus: parseInt(this.editScheduleFormGroup.value.planStatus),
        createDate: this.editScheduleFormGroup.value.createDate,
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
    this.scheduleEdit = null;
    this.indexTourishScheduleEdit = -1;
  }

  removeSchedule(id: string): void {
    var index = this.scheduleList.findIndex((entity) => entity.id === id);

    if (index > -1) {
      console.log(this.scheduleList[index]);
      this.scheduleList.splice(index, 1);
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
    this.scheduleFormGroup.reset({
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

  cancelLoading() {
    this.isLoading = false;
  }

  getScheduleEditId(): string {
    if (this.scheduleEdit !== null) {
      return this.scheduleEdit.id ?? "";
    }
    return "";
  }

  getStatusPhase(statusNumber: string): string {

    switch (parseInt(statusNumber)) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Xác nhận thông tin";
      case 2:
        return "Đang diễn ra";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Hủy bỏ";
      default:
        return "Không xác định";
    }
  }

  onClickAddButton(){
    console.log("here");
    this.isNewEdited = !this.isNewEdited;
  }
}
