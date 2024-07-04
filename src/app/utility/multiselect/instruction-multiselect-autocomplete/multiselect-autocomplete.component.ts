import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MessageService } from "../../user_service/message.service";
import { Instruction } from "src/app/model/baseModel";
import { ThemePalette } from "@angular/material/core";
/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "instruction-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class InstructionMultiselectAutocompleteComponent implements OnInit, OnChanges {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingCtrl = new FormControl("");
  @ViewChild("picker") movingPicker: any;

  @Output() result = new EventEmitter<{ data: Array<Instruction> }>();

  @Input() targetId: string = "";
  @Input() targetType: string = "";

  @Input() data_selected: Array<Instruction> = [];
  @Input() key: string = "";
  @Input() createFormOpen = false;

  data_selected_edit: Instruction[] = [];
  instructionList: Instruction[] = [];

  instructionEdit: Instruction | null = null;
  indexInstructionEdit: number = -1;

  instructionIdList: string[] = [];
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

  instructionFormGroup!: FormGroup;

  editInstructionFormGroup!: FormGroup;

  isSubmit = false;
  disableType = false;
  @Input() disabled: boolean = false;

  @ViewChild("movingInput") movingInput!: ElementRef<HTMLInputElement>;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_selected']){
      this. data_selected_edit = [...this.data_selected];
    }
  }

  ngOnInit(): void {
    // this.data_selected_edit = [...this.data_selected];

    this.instructionFormGroup = this.fb.group({
      description: ["", Validators.compose([Validators.required])],
      instructionType: ["", Validators.compose([Validators.required])],
    });

    this.editInstructionFormGroup = this.fb.group({
      description: ["", Validators.compose([Validators.required])],
      instructionType: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    
  }

  remove(id: string): void {
    const index = this.instructionIdList.indexOf(id);
    if (index >= 0) {
      this.instructionIdList.splice(index, 1);
      this.createFormOpen = false;
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    var returnList = this.data_selected_edit.concat(this.instructionList);
    this.result.emit({ data: returnList });
  };

  addToSchedule(): void {
    this.isSubmit = true;

    if (this.instructionFormGroup.valid && this.instructionFormGroup.dirty) {
      const instruction: Instruction = {
        description: this.instructionFormGroup.value.description,
        instructionType: parseInt(this.instructionFormGroup.value.instructionType),
      };

      if (this.targetId.length > 0) {
        if (this.targetType === "TourishPlan")
          instruction.tourishPlanId = this.targetId;

        if (this.targetType === "MovingSchedule")
          instruction.movingScheduleId = this.targetId;

        if (this.targetType === "StayingSchedule")
          instruction.stayingdScheduleId = this.targetId;
      }

      this.instructionList = [instruction, ...this.instructionList];

      this.emitAdjustedData();
      this.formReset();
    }
  }

  clickEditSchedule(id: string): void {
    var existIndex = this.data_selected_edit.findIndex(
      (entity) => entity.id === id
    );
    if (existIndex > -1) {
      this.instructionEdit = this.data_selected_edit[existIndex];
      this.indexInstructionEdit = existIndex;

      this.editInstructionFormGroup.controls["description"].setValue(
        this.instructionEdit.description
      );
      this.editInstructionFormGroup.controls["instructionType"].setValue(
        this.instructionEdit.instructionType
      );
    }
  }

  editToSchedulesList() {
    if (this.indexInstructionEdit > -1 && this.instructionEdit != null) {
      this.data_selected_edit[this.indexInstructionEdit] = {
        id: this.instructionEdit.id,
        description: this.editInstructionFormGroup.value.description,
        instructionType: parseInt(this.editInstructionFormGroup.value.instructionType),
      };
      if (this.targetId.length > 0) {
        if (this.targetType === "TourishPlan")
          this.data_selected_edit[this.indexInstructionEdit].tourishPlanId =
            this.targetId;

        if (this.targetType === "MovingSchedule")
          this.data_selected_edit[this.indexInstructionEdit].movingScheduleId =
            this.targetId;

        if (this.targetType === "StayingSchedule")
          this.data_selected_edit[
            this.indexInstructionEdit
          ].stayingdScheduleId = this.targetId;
      }

      this.messageService
        .openNotifyDialog("Thay đổi thành công")
        .subscribe(() => {
          this.cancelEditSchedule();
          this.emitAdjustedData();
        });
    }
  }

  cancelEditSchedule(): void {
    this.instructionEdit = null;
    this.indexInstructionEdit = -1;
  }

  removeSchedule(id: string): void {
    var index = this.instructionList.findIndex((entity) => entity.id === id);

    if (index > -1) {
      this.instructionList.splice(index, 1);
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
    this.instructionFormGroup.reset({
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
    if (this.instructionEdit !== null) {
      return this.instructionEdit.id ?? "";
    }
    return "";
  }

  onClickAddButton() {
    
    this.isNewEdited = !this.isNewEdited;
  }

  displayDescription(input: string) {
    return input.length > 150 ? input.substring(0, 150) : input;
  }
}
