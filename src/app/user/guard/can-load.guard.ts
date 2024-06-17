import { Injectable, inject } from '@angular/core';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/utility/user_service/token.service';
@Injectable({
  providedIn: 'root',
})
export class CanLoadGuardUser {
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

export const isUserGuard = (
  route: Route,
  segments: UrlSegment[]
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(CanLoadGuardUser).canLoad(route, segments);
};
