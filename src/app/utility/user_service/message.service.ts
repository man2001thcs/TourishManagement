import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { NotifyDialogComponent } from "../notification_admin/notify-dialog.component";
import { FailNotifyDialogComponent } from "../notification_admin/fail-notify-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import {
  ERR_MESSAGE_CODE_VI,
  SUCCESS_MESSAGE_CODE_VI,
} from "../config/messageCode";
import { LoadingDialogComponent } from "../notification_admin/loading-dialog.component";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  currentDialogRef: any;
  constructor(private dialog: MatDialog) {}

  openNotifyDialog(this_announce: string) {
    const ref = this.dialog.open(NotifyDialogComponent, {
      data: {
        title: this_announce,
      },
    });
    return ref.afterClosed();
  }

  openLoadingDialog() {
    this.currentDialogRef = this.dialog.open(LoadingDialogComponent, {
      data: {},
    });
    return this.currentDialogRef.afterClosed();
  }

  closeLoadingDialog() {
    if (this.currentDialogRef !== undefined) this.currentDialogRef.close();
  }

  openFailNotifyDialog(this_announce: string) {
    const ref = this.dialog.open(FailNotifyDialogComponent, {
      data: {
        title: this_announce,
      },
    });
    return ref.afterClosed();
  }

  openSystemFailNotifyDialog(httpStatus: any) {
    let this_announce = "";

    if (httpStatus?.status !== undefined) {
      if (httpStatus.status == "403") {
        this_announce = "Bạn không có thẩm quyền để thực hiện hành động này";
      } else if (httpStatus.status == "504") {
        this_announce = "Mất kết nối với server, vui lòng thử lại sau";
      } else if (httpStatus.status == "0") {
        this_announce = "Lỗi không xác định";
      }
    }

    const ref = this.dialog.open(FailNotifyDialogComponent, {
      data: {
        title: this_announce,
      },
    });

    return ref.afterClosed();
  }

  closeAllDialog() {
    this.dialog.closeAll();
  }

  openMessageNotifyDialog(this_announce_code: string) {
    let message_announce = "";
    if (this_announce_code.startsWith("C")) {
      if (this_announce_code.startsWith("C001-ex"))
        message_announce = this.parseTimeDifference(this_announce_code);
      else message_announce = ERR_MESSAGE_CODE_VI.get(this_announce_code) ?? "";

      return this.openFailNotifyDialog(message_announce ?? "");
    } else if (this_announce_code.startsWith("I")) {
      message_announce = SUCCESS_MESSAGE_CODE_VI.get(this_announce_code) ?? "";
      return this.openNotifyDialog(message_announce ?? "");
    }

    return null;
  }

  private parseTimeDifference(timeDiff: string): string {
    const regex = /C001-ex-(\d+)-(\d+)/;
    const matches = regex.exec(timeDiff);
    let errorString =
      "Số lượt đăng nhập đã vượt quá cho phép, vui lòng chờ 2 tiếng sau rồi thử lại";

    if (matches && matches.length === 3) {
      const hours = parseInt(matches[1], 10);
      const minutes = parseInt(matches[2], 10);

      if (hours <= 0)
        errorString = `Số lượt đăng nhập đã vượt quá cho phép, vui lòng chờ ${minutes} phút sau rồi thử lại`;
      else
        errorString = `Số lượt đăng nhập đã vượt quá cho phép, vui lòng chờ ${hours} tiếng ${minutes} sau rồi thử lại`;
    }
    return errorString;
  }

  openSystemErrNotifyDialog(this_announce_code: string, this_err_mess: string) {
    let message_announce = "";
    if (this_announce_code.startsWith("C") && this_err_mess != "") {
      message_announce = ERR_MESSAGE_CODE_VI.get(this_announce_code) ?? "";
      this.openFailNotifyDialog(message_announce + ": " + this_err_mess ?? "");
    }
  }
}
