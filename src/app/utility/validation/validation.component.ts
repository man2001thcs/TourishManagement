import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

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
      this.message = "Vui lòng nhập Email";
    }

    if (this.formGroup.get(this.formGroupControlName)?.hasError('min')){
      const min = this.formGroup.get(this.formGroupControlName)?.errors?.["min"];
      this.message = "Vui lòng nhập tối thiểu " + min ?? 0;
    }

    if (
      this.formGroup.get(this.formGroupControlName)?.hasError("minLength")
    ) {
      const min = this.formGroup.get(this.formGroupControlName)?.errors?.["minLength"];
      this.message = "Vui lòng nhập tối thiểu " + min ?? 0;
    }

    if (this.formGroupControlName === "password") {
      if (
        this.formGroup.get(this.formGroupControlName)?.hasError("minLength")
      ) {
        this.message = "Vui lòng nhập từ 6 -> 16 kí tự cho mật khẩu";
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
