import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";

@Component({
  selector: "app-tourish-pack",
  templateUrl: "./tourish-pack.component.html",
  styleUrls: ["./tourish-pack.component.css"],
})
export class TourishPackComponent implements OnInit, AfterViewInit {
  @Input()
  data!: string;
  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  color: ThemePalette = "primary";

  constructor(private fb: FormBuilder, private renderer: Renderer2) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });
  }

  ngAfterViewInit() {
    this.adjustSize();

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.adjustSize();
      }
    });

    // Observe the childDiv element for size changes
    resizeObserver.observe(this.packContainer.nativeElement);
  }

  adjustSize() {
    let childWidth = parseInt(this.packContainer.nativeElement.offsetWidth, 0);
    // Example logic, you can adjust this according to your needs
    if (childWidth >= 1700) {
      console.log("here");
      // this.packContainer.nativeElement.style["border-right"] = "30px 18% 30px";
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 18% 30px"
      );
    } else if (childWidth < 1700 && childWidth >= 1500) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 13% 30px"
      );
    } else if (childWidth < 1500 && childWidth >= 1200) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else if (childWidth < 1200 && childWidth >= 900) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 10% 30px"
      );
    }
  }

  slides: any[] = [
    {
      url: "https://picsum.photos/id/944/900/500",
      title: "First slide",
      description: "This is the first slide",
    },
    {
      url: "https://picsum.photos/id/1011/900/500",
      title: "Second slide",
      description: "This is the second slide",
    },
    {
      url: "https://picsum.photos/id/984/900/500",
      title: "Third slide",
      description: "This is the third slide",
    },
  ];

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
}
