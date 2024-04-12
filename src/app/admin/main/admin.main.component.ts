import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class AdminMainComponent {
  @ViewChild("adminMain")
  myNameElem!: ElementRef;

  @ViewChild("adminContent")
  adminContent!: ElementRef;
  
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
    this.adminContent.nativeElement.style["padding-left"] = "3%";
    this.adminContent.nativeElement.style["padding-right"] = "3%";
    this.isNavOpen = true;
  }

  closetNav() {
    this.myNameElem.nativeElement.style["margin-left"] = "80px";
    this.adminContent.nativeElement.style["padding-left"] = "12%";
    this.adminContent.nativeElement.style["padding-right"] = "12%";
    this.isNavOpen = false;
  }
}
