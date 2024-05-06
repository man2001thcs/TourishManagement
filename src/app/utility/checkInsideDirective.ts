import { Directive, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appInViewport]'
})
export class InViewportDirective implements OnDestroy {
  @Output() inViewport: EventEmitter<boolean> = new EventEmitter<boolean>();
  private observer: IntersectionObserver;
  private timer: any; // Biến lưu đồng hồ đếm

  constructor(private el: ElementRef) {
    // Tạo IntersectionObserver để theo dõi các phần tử mới xuất hiện
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Nếu trong viewport, thực hiện hành động tương ứng
          this.startTimer();
        } else {
          // Nếu không trong viewport, dừng hành động tương ứng
          this.clearTimer();
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
    this.clearTimer(); // Huỷ đồng hồ đếm khi Directive bị huỷ
  }

  // Hàm bắt đầu đồng hồ đếm
  private startTimer() {
    // Huỷ đồng hồ đếm cũ (nếu có)
    this.clearTimer();
    // Bắt đầu đồng hồ đếm mới
    this.timer = setTimeout(() => {
      this.inViewport.emit(true); // Gửi sự kiện khi đã chờ đủ thời gian
    }, 2000); // Chờ 3 giây
  }

  // Hàm huỷ đồng hồ đếm
  private clearTimer() {
    clearTimeout(this.timer);
  }
}