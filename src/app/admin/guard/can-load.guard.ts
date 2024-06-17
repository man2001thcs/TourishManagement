import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/utility/user_service/token.service';
import { UserService } from 'src/app/utility/user_service/user.service';

@Injectable({
  providedIn: 'root',
})
export class CanLoadGuardAdmin {
  constructor(private tokenService: TokenStorageService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let roles = route.data?.['permittedRoles'] as Array<string>;

    if (roles) {
      if (roles.indexOf(this.tokenService.getUserRole()) > -1) return true;
      else {
        //this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return false;
    // return this.userService.current_user.id_admin === 1;
  }
}

export const isAdminGuard = (
  route: Route,
  segments: UrlSegment[]
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(CanLoadGuardAdmin).canLoad(route, segments);
};
