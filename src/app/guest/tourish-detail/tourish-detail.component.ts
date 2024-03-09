import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";

@Component({
  selector: "app-tourish-detail",
  templateUrl: "./tourish-detail.component.html",
  styleUrls: ["./tourish-detail.component.css"],
  
})
export class TourishDetailComponent implements OnInit{
  @Input()
  data!: string;

  active =1;

  setTourForm!: FormGroup;

  isSubmit= false;

  constructor(private fb: FormBuilder){

  }

  ngOnInit(){
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
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
