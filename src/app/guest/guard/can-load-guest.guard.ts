import { Injectable, inject } from "@angular/core";
import { CanLoad, Route, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
@Injectable({
  providedIn: "root",
})
export class CanLoadGuestGuard implements CanLoad {
  constructor(private tokenService: TokenStorageService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}

export const isGuestGuard = (
  route: Route,
  segments: UrlSegment[]
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(CanLoadGuestGuard).canLoad(route, segments);
};
