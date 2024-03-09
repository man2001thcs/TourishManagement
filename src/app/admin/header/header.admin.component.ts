import { User } from "../../model/user";
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NavigationEnd, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { UserService } from "src/app/utility/user_service/user.service";

import { filter } from "rxjs/operators";
import { getHeaderPhase } from "src/app/utility/config/headerCode";

@Component({
  selector: "app-admin-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderAdminComponent implements OnDestroy {
  @ViewChild("mySidenav")
  myNameElem!: ElementRef;

  @ViewChild("header")
  headerElem!: ElementRef;

  @ViewChild("autocompleteSearch")
  autocompleteSearch!: ElementRef;

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  @Output() checkNavOpen = new EventEmitter<boolean>();

  activeItem = "1st";
  isNavOpen = true;
  isAutoCompleteOpen = false;

  filteredInput!: Observable<string | null>;
  searchFormGroup!: FormGroup;

  searchControl = new FormControl("");

  countNavClick = 0;
  countSearchClick = 0;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private tokenService: TokenStorageService,
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2
  ) {}

  id = 0;

  ngOnInit(): void {
    this.id = Number(localStorage.getItem("id")) ?? 0;
    console.log(localStorage.getItem("id"));

    this.activeItem = getHeaderPhase(this.router.url);

    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            console.log(event.url);
            this.activeItem = getHeaderPhase(event.url);
          }
        })
    );

    this.searchFormGroup = this.fb.group({
      searchValue: [
        "",
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern(/^[a-z]{6,32}$/i),
        ]),
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  userInfo() {
    this.router.navigate(["/admin/account/info"]);
  }

  async signOut() {
    await this.tokenService.signOut();
    this.router.navigate(["/guest/login"]);
  }

  outsideClick(hasClickedOutside: any) {
    // if (hasClickedOutside && this.isNavOpen) {
    //   this.countNavClick++;
    //   console.log(this.countNavClick);
    //   if (this.countNavClick >= 2) this.closeNav();
    // }
  }

  outsideAutoCompleteSearchClick(hasClickedOutside: any) {
    if (hasClickedOutside && this.isAutoCompleteOpen) {
      this.countSearchClick++;
      if (this.countSearchClick >= 1) this.closeAutoCompleteSearch();
    }
  }

  addNewItem(value: boolean) {
    this.checkNavOpen.emit(value);
  }

  openNav() {

    if (window.innerWidth >= 850){
      this.myNameElem.nativeElement.style.width = "340px";
      this.myNameElem.nativeElement.style["margin-right"] = "0px";
      this.myNameElem.nativeElement.style["padding-top"] = "0px";
      this.myNameElem.nativeElement.style["padding-left"] = "0px";
      this.myNameElem.nativeElement.style["padding-right"] = "0px";
      this.myNameElem.nativeElement.style["border-bottom"] = "2px solid #EDF1F7";
      this.myNameElem.nativeElement.style["border-right"] = "2px solid #EDF1F7";      
    } else {
      console.log("abc");
      this.renderer.setStyle(this.myNameElem.nativeElement, 'width', '100%');

      //this.myNameElem.nativeElement.style.width = "100%";
      this.myNameElem.nativeElement.style["margin-top"] = "0px";
      this.myNameElem.nativeElement.style["margin-right"] = "0px";
      this.myNameElem.nativeElement.style["padding-top"] = "0px";
      this.myNameElem.nativeElement.style["padding-left"] = "40px";
      this.myNameElem.nativeElement.style["padding-right"] = "25px";
      this.myNameElem.nativeElement.style["border-bottom"] = "2px solid #EDF1F7";
      this.myNameElem.nativeElement.style["border-right"] = "2px solid #EDF1F7";
    }

    this.isNavOpen = true;
    this.addNewItem(this.isNavOpen);
  }

  closeNav() {
    this.myNameElem.nativeElement.style.width = "80px";
    this.myNameElem.nativeElement.style["margin-right"] = "0px";
    this.myNameElem.nativeElement.style["margin-top"] = "0px";
    this.myNameElem.nativeElement.style["padding-left"] = "0px";
    this.myNameElem.nativeElement.style["padding-right"] = "0px";
    this.myNameElem.nativeElement.style["border-bottom"] = "0px solid #EDF1F7";
    this.myNameElem.nativeElement.style["border-left"] = "0px solid #EDF1F7";
    this.myNameElem.nativeElement.style["border-right"] = "0px solid #EDF1F7";

    this.headerElem.nativeElement.style["width"] = "70%";
    document.body.style.backgroundColor = "white";

    this.isNavOpen = false;
    this.countNavClick = 0;
    this.addNewItem(this.isNavOpen);
  }

  openAutoCompleteSearch() {
    this.autocompleteSearch.nativeElement.style.height = "fit-content";
    this.autocompleteSearch.nativeElement.style["margin-top"] = "30px";
    this.autocompleteSearch.nativeElement.style["padding-top"] = "25px";
    this.autocompleteSearch.nativeElement.style["padding-bottom"] = "25px";
    this.autocompleteSearch.nativeElement.style["border-bottom"] =
      "2px solid #EDF1F7";
    this.autocompleteSearch.nativeElement.style["border-left"] =
      "2px solid #EDF1F7";
    this.autocompleteSearch.nativeElement.style["border-right"] =
      "2px solid #EDF1F7";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    this.isAutoCompleteOpen = true;
  }

  closeAutoCompleteSearch() {
    this.autocompleteSearch.nativeElement.style.height = "0";
    this.autocompleteSearch.nativeElement.style["padding-top"] = "0";
    this.autocompleteSearch.nativeElement.style["margin-top"] = "25px";
    this.autocompleteSearch.nativeElement.style["padding-bottom"] = "0px";
    this.autocompleteSearch.nativeElement.style["border-bottom"] =
      "0px solid #EDF1F7";
    this.autocompleteSearch.nativeElement.style["border-left"] =
      "0px solid #EDF1F7";
    this.autocompleteSearch.nativeElement.style["border-right"] =
      "0px solid #EDF1F7";
    document.body.style.backgroundColor = "white";
    this.isAutoCompleteOpen = false;
    this.countSearchClick = 0;
  }

  async navMenuClick() {
    if (this.isNavOpen) {
      await this.closeNav();
    } else if (!this.isNavOpen) {
      await this.openNav();
    }
  }

  async navigateUrl(url: string) {
    this.router.navigate(["admin/" + url]);
  }

  formSubmit(): void {}
}
