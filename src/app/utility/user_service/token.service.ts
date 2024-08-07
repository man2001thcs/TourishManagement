import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Store } from "@ngrx/store";
import { LoginUnionActions } from "src/app/guest/log/login/login.store.action";
import * as LoginAction from "src/app/guest/log/login/login.store.action";
import { HashService } from "./hash.service";

const TOKEN_KEY = "auth-token";
const REFRESHTOKEN_KEY = "auth-refreshtoken";
const USER_KEY = "auth-user";
const CART_KEY = "auth-user-cart";

const REMEMBER_USERNAME = "auth-user-name";
const REMEMBER_PASSWORD = "auth-password";
const REMEMBER_KEY = "roxanna";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

interface CartItem {
  id: string;
  type: number;
  quantity: number;
}

export enum UserRole {
  New = 0,
  User = 1,
  AdminTemp = 2,
  Admin = 3,
  AdminManager = 4,
}

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor(
    private http: HttpClient,
    private store: Store<LoginUnionActions>,
    private socialAuthService: SocialAuthService,
    private hashService: HashService
  ) {}

  handleRememberMe(userName: string, password: string) {
    window.localStorage.removeItem(REMEMBER_USERNAME);
    window.localStorage.setItem(
      REMEMBER_USERNAME,
      this.hashService.encryptedString(userName, REMEMBER_KEY)
    );

    window.localStorage.removeItem(REMEMBER_PASSWORD);
    window.localStorage.setItem(
      REMEMBER_PASSWORD,
      this.hashService.encryptedString(password, REMEMBER_KEY)
    );
  }

  cancelRememberMe() {
    window.localStorage.removeItem(REMEMBER_USERNAME);
    window.localStorage.setItem(REMEMBER_USERNAME, "");

    window.localStorage.removeItem(REMEMBER_PASSWORD);
    window.localStorage.setItem(REMEMBER_PASSWORD, "");
  }

  returnRememberMe() {
    let userName = "";
    if (window.localStorage.getItem(REMEMBER_USERNAME))
      userName = this.hashService.dencryptedString(
        window.localStorage.getItem(REMEMBER_USERNAME) ?? "",
        REMEMBER_KEY
      );

    let password = "";
    if (window.localStorage.getItem(REMEMBER_PASSWORD))
      password = this.hashService.dencryptedString(
        window.localStorage.getItem(REMEMBER_PASSWORD) ?? "",
        REMEMBER_KEY
      );

    return {
      userName,
      password,
    };
  }

  signInWithGoogle() {
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    // window.localStorage.clear();
    window.localStorage.setItem(TOKEN_KEY, "");
    window.localStorage.setItem(REFRESHTOKEN_KEY, "");
    window.localStorage.setItem(USER_KEY, "");

    this.store.dispatch(LoginAction.resetLogin());
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);

    const user = this.getUser();
    if (user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken(): string {
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string {
    return window.localStorage.getItem(REFRESHTOKEN_KEY) ?? "";
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));

    window.localStorage.setItem(CART_KEY, JSON.stringify([]));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public saveCart(singleReceipt: CartItem): void {
    const cartString = window.localStorage.getItem(CART_KEY);
    window.localStorage.removeItem(CART_KEY);
    let cartArray: Array<CartItem> = [];

    if (cartString) {
      cartArray = JSON.parse(cartString);

      let isExist = cartArray.findIndex((element: any) => {
        return element.id === singleReceipt.id;
      });

      if (isExist > -1) {
        cartArray[isExist].quantity += singleReceipt.quantity;
      } else {
        cartArray.push(singleReceipt);
      }
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
  }

  public removeCart(singleReceipt: CartItem): void {
    const cartString = window.localStorage.getItem(CART_KEY);
    window.localStorage.removeItem(CART_KEY);
    let cartArray: Array<CartItem> = [];

    if (cartString) {
      cartArray = JSON.parse(cartString);

      let isExist = cartArray.findIndex((element: any) => {
        return element.id === singleReceipt.id;
      });

      if (isExist > -1) {
        cartArray.splice(isExist, 1);
      }
    }

    window.localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
  }

  public removeAllCart(): void {
    window.localStorage.removeItem(CART_KEY);

    window.localStorage.setItem(CART_KEY, JSON.stringify([]));
  }

  public getCart(): any {
    const cart = window.localStorage.getItem(CART_KEY);
    if (cart) {
      return JSON.parse(cart);
    }
    return {};
  }

  public getUserRole(): string {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).Role;
    }
    return "";
  }

  refreshToken(accessToken: string, refreshToken: string) {
    return this.http.post(
      "/api/User/RenewToken",
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      httpOptions
    );
  }

  getUserRoleInNumber(): number {
    const user = window.localStorage.getItem(USER_KEY);
    var role = "";
    if (user) {
      role = JSON.parse(user).Role;
    }
    switch (role.toLowerCase()) {
      case "new":
        return UserRole.New;
      case "user":
        return UserRole.User;
      case "admintemp":
        return UserRole.AdminTemp;
      case "admin":
        return UserRole.Admin;
      case "adminmanager":
        return UserRole.AdminManager;
      default:
        throw new Error("Invalid user role");
    }
  }

  decodeBase64Url(base64Url: string): string {
    let decodedData = atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'));
    decodedData = decodeURIComponent(escape(decodedData));
    return decodedData;
  }

  // public roleMatch(allowedRoles): boolean {
  //   var isMatch = false;
  //   var payLoad = JSON.parse(window.atob(this.getUser().split('.')[1]));
  //   var userRole = payLoad.role;
  //   allowedRoles.forEach(element => {
  //     if (userRole == element) {
  //       isMatch = true;
  //       return false;
  //     }
  //   });
  //   return isMatch;
  // }
}
