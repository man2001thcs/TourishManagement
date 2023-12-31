import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-guest-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  
  @ViewChild("guestMain")
  myNameElem!: ElementRef;

  ngOnInit(): void {
    console.log("init");
  }

  isNavOpen = true;

  checkNavOpen($event: any) {
    console.log($event);
    if ($event) this.openNav();
    else this.closetNav();
  }

  openNav() {
    this.myNameElem.nativeElement.style["margin-left"] = "340px";
    this.isNavOpen = true;
  }

  closetNav() {
    this.myNameElem.nativeElement.style["margin-left"] = "0";
    this.isNavOpen = false;
  }
}
