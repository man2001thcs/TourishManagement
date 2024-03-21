import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, SecurityContext, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { SaveFile, TourishPlan } from "src/app/model/baseModel";
declare let tinymce: any;

@Component({
  selector: "app-html-sanitizer",
  templateUrl: "./html-sanitizer.component.html",
  styleUrls: ["./html-sanitizer.component.css"],
})
export class HtmlSanitizerComponent {
  @Input()
  htmlString!: string;

  constructor(private sanitizer: DomSanitizer) {}

  getSanitizedContent(content: string): SafeHtml {
    const tinyMceStyles = `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src='https://cloud.tinymce.com/stable/tinymce.min.js'></script>
    `;
    
    const sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, content);
    const safeStyle = this.sanitizer.bypassSecurityTrustStyle(tinyMceStyles);
    return this.sanitizer.bypassSecurityTrustHtml(`<style>${tinyMceStyles}</style>${sanitizedContent}`);
  }
  
}
