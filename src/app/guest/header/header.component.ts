import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../log/login/login.component";
import { FormControl, FormGroup } from "@angular/forms";
import { OnInitEffects } from "@ngrx/effects";
import { NbDialogService } from "@nebular/theme";
import { Observable, Subscription, debounceTime } from "rxjs";
import { UserService } from "src/app/utility/user_service/user.service";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-guest-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @ViewChild("mySidenav")
  myNameElem!: ElementRef;

  @ViewChild("header")
  headerElem!: ElementRef;

  @ViewChild("autocompleteSearch")
  autocompleteSearch!: ElementRef;

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  @Output() checkNavOpen = new EventEmitter<boolean>();

  addNewItem(value: boolean) {
    this.checkNavOpen.emit(value);
  }

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
    public dialog: MatDialog,
    private messageService: MessageService,
    private router: Router,
    private _elementRef: ElementRef,
    private _api: UserService,
    private renderer: Renderer2
  ) {
    this.filteredInput = this.searchControl.valueChanges.pipe(
      debounceTime(400)
    );
  }

  ngOnInit(): void {
    this.searchFormGroup = new FormGroup({
      search: new FormControl(),
    });
  }

  // openDialog() {
  //   const ref = this.dialog.open(LoginComponent, {
  //     data: {
  //       title: 'Do you want to leave this page?',
  //     },
  //   });
  //   ref.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });

  //   return ref.afterClosed();
  // }

  openLoginDialog() {
    this.router.navigate(["guest/login"]);
  }

  formSubmit(): void {}

  openNav() {
    if (window.innerWidth >= 850) {
      this.myNameElem.nativeElement.style.width = "340px";
      this.myNameElem.nativeElement.style["margin-right"] = "0px";
      this.myNameElem.nativeElement.style["padding-top"] = "0px";
      this.myNameElem.nativeElement.style["padding-left"] = "0px";
      this.myNameElem.nativeElement.style["padding-right"] = "0px";
      this.myNameElem.nativeElement.style["border-bottom"] =
        "2px solid #EDF1F7";
      this.myNameElem.nativeElement.style["border-right"] = "2px solid #EDF1F7";
    } else {
      console.log("abc");
      this.renderer.setStyle(this.myNameElem.nativeElement, "width", "100%");

      //this.myNameElem.nativeElement.style.width = "100%";
      this.myNameElem.nativeElement.style["margin-top"] = "0px";
      this.myNameElem.nativeElement.style["margin-right"] = "0px";
      this.myNameElem.nativeElement.style["padding-top"] = "0px";
      this.myNameElem.nativeElement.style["padding-left"] = "40px";
      this.myNameElem.nativeElement.style["padding-right"] = "25px";
      this.myNameElem.nativeElement.style["border-bottom"] =
        "2px solid #EDF1F7";
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

  async navMenuClick() {
    if (this.isNavOpen) {
      await this.closeNav();
    } else if (!this.isNavOpen) {
      await this.openNav();
    }
  }

  async navigateUrl(url: string) {
    this.router.navigate(["guest/" + url]);
  }

  getBlobUrl(){
    return environment.backend.blobURL;
  }
}
