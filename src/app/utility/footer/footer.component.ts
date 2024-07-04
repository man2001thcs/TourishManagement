import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { TokenStorageService } from "../user_service/token.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  @Input() isNavOpen: boolean = true;
  @ViewChild("footerEle")
  footerElem!: ElementRef;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}

  ngAfterViewChecked(): void {
    if (this.isNavOpen) {
      if (this.footerElem.nativeElement !== undefined)
        this.footerElem.nativeElement.style["padding"] = "45px 6% 20px";
    } else {
      if (this.footerElem.nativeElement !== undefined)
        this.footerElem.nativeElement.style["padding"] = "45px 16% 20px";
    }
  }

  navigateTo(url: string) {
    if (this.tokenStorageService.getUserRole() === "User")
      this.router.navigate(["user/" + url]);
    else if (
      this.tokenStorageService.getUserRole() === "Admin" ||
      this.tokenStorageService.getUserRole() === "AdminManager"
    )
      this.router.navigate(["admin/" + url]);
    else this.router.navigate(["guest/" + url]);
  }
}
