import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";

@Component({
  selector: "app-tourish-main",
  templateUrl: "./tourish-main.component.html",
  styleUrls: ["./tourish-main.component.css"],
  
})
export class TourishMainComponent implements OnInit{
  @Input()
  data!: string;
  @ViewChild("picker") eatingPicker: any;

  active =1;

  setTourForm!: FormGroup;
  isSubmit= false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  color: ThemePalette = "primary";

  constructor(private fb: FormBuilder){

  }

  ngOnInit(){
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      startingPlace: ["", Validators.compose([Validators.required])],
    });
  }

  slides: any[] = [
    {
      url: 'https://picsum.photos/id/944/900/500',
      title: 'First slide',
      description: 'This is the first slide',
    },
    {
      url: 'https://picsum.photos/id/1011/900/500',
      title: 'Second slide',
      description: 'This is the second slide',
    },
    {
      url: 'https://picsum.photos/id/984/900/500',
      title: 'Third slide',
      description: 'This is the third slide',
    }
  ];
  
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
}
