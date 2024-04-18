import { Component, OnInit, Inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
  title: string;
}

@Component({
  selector: "app-validation",
  templateUrl: "./validation.component.html",
  styleUrls: ["./validation.component.css"],
})
export class ValidationComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formGroupControlName = "";

  message = "Lỗi";

  constructor() {}

  ngOnInit() {
    if (this.formGroup.get(this.formGroupControlName)?.hasError('email') &&
    !this.formGroup.get(this.formGroupControlName)?.hasError('required')){
      this.message = "Vui lòng nhập Email.";
    }

    if (this.formGroup.get(this.formGroupControlName)?.hasError('min')){
      const min = this.formGroup.get(this.formGroupControlName)?.errors?.["min"];
      this.message = "Vui lòng nhập tối thiểu " + min ?? 0;
    }

    if (this.formGroupControlName === "password") {
      if (
        this.formGroup.get(this.formGroupControlName)?.hasError("minLength")
      ) {
        this.message = "Vui lòng nhập từ 6 -> 16 kí tự.";
      } else if (
        this.formGroup.get(this.formGroupControlName)?.hasError("required")
      ) {
        this.message = "Vui lòng nhập nội dung";
      }
    } else {
      if (this.formGroup.get(this.formGroupControlName)?.hasError("required")) {
        this.message = "Vui lòng nhập nội dung";
      }
    }
  }
}
