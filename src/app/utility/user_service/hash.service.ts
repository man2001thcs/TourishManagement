import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class HashService {
  private CryptoJSAesJson = {
    stringify: function (cipherParams: any) {
      const vbJsonString = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
        iv: cipherParams.iv.toString() ?? "",
        s: cipherParams.salt.toString() ?? "",
      };
      if (cipherParams.iv) {
        vbJsonString["iv"] = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        vbJsonString["s"] = cipherParams.salt.toString();
      }
      return JSON.stringify(vbJsonString);
    },
    parse: function (jsonStr: any) {
      const vbJsonParse = JSON.parse(jsonStr);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(vbJsonParse.ct),
      });
      if (vbJsonParse.iv) {
        cipherParams["iv"] = CryptoJS.enc.Hex.parse(vbJsonParse.iv);
      }
      if (vbJsonParse["s"]) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(vbJsonParse.s);
      }
      return cipherParams;
    },
  };

  encryptedString(message: string, password: string): string {
    let encrypted = CryptoJS.AES.encrypt(message, password, {
      format: this.CryptoJSAesJson,
    }).toString();
    return encrypted;
  }

  dencryptedString(encrypted: string, password: string): string {
    let decrypted = CryptoJS.AES.decrypt(encrypted, password, {
      format: this.CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
