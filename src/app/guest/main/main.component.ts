import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-guest-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  
  @ViewChild("guestMain")
  myNameElem!: ElementRef;

  @ViewChild("outerChat")
  outerChat!: ElementRef;

  ngOnInit(): void {
    console.log("init");
  }

  isNavOpen = true;

  checkNavOpen($event: any) {
    
    if ($event) this.openNav();
    else this.closetNav();
  }

  openNav() {
    this.myNameElem.nativeElement.style["margin-left"] = "340px";
    this.isNavOpen = true;
  }

  closetNav() {
    this.myNameElem.nativeElement.style["margin-left"] = "60px";
    this.isNavOpen = false;
  }

  isChatOpen($event:boolean){
    
    if ($event){
      this.outerChat.nativeElement.style["transform"] = "translate(0, -400px)";
    } else {
      this.outerChat.nativeElement.style["transform"] = "translate(0, 0)";
    }
  }
}
