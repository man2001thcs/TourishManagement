import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../utility/user_service/user.service';
import { AdminService } from '../service/admin.service';
@Injectable({
  providedIn: 'root',
})
export class CanEditAdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //return this.adminService.getBook(route.paramMap.get('id')!).pipe(
    //  map((book) => {
        //return book.Post.user_account === this.userService.current_user.email;
    //  })
    //);
    return true;
  }
}
