import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { catchError, of } from "rxjs";
import { ChartConfig } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";

export interface InMonthGross {
  name: string;
  gross: number;
}

export interface InMonthTicket {
  name: string;
  totalTicket: number;
}

export interface MonthlyGross {
  month: number;
  year: number;
  gross: number;
}

export interface ChartData {
  name: string;
  type?: string;
  data: number[];
}

export interface UnpaidGuest {
  guestName: string;
  originalPrice: number;
  totalTicket: number;
  totalChildTicket: number;
  discountFloat: number;
  discountAmount: number;
}

export interface UnpaidGroup {
  name: string;
  guestList: UnpaidGuest[];
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  monthCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  lineChartOptions!: ChartConfig;
  lineChartOptionsTemp!: any;

  colChartOptions!: ChartConfig;
  colChartOptionsTemp: any;

  colMovingChartOptions!: ChartConfig;
  colMovingChartOptionsTemp: any;

  colStayingChartOptions!: ChartConfig;
  colStayingChartOptionsTemp: any;

  pieTourChartOptions!: ChartConfig;
  pieTourChartOptionsTemp: any;

  pieMovingChartOptions!: ChartConfig;
  pieMovingChartOptionsTemp: any;

  pieStayingChartOptions!: ChartConfig;
  pieStayingChartOptionsTemp: any;

  tourUnpaidGroup: UnpaidGroup[] = [];
  movingUnpaidGroup: UnpaidGroup[] = [];
  stayingUnpaidGroup: UnpaidGroup[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadLineChart();

    this.loadTourColChart();
    this.loadTourPieChart();

    this.loadMovingColChart();
    this.loadMovingPieChart();

    this.loadStayingColChart();
    this.loadStayingPieChart();

    this.getUpaidClientInTour();
    this.getUpaidClientInMoving();
    this.getUpaidClientInStaying();
  }

  loadLineChart(): void {
    const now = new Date();
    const month = now.getMonth() + 1;

    this.lineChartOptions = {
      chart: {
        type: "spline",
      },
      title: {
        text: "Thống kê doanh thu theo tháng",
      },
      subtitle: {
        text: "Doanh thu tổng cộng",
      },
      xAxis: {
        categories: this.monthCategories.slice(0, month),
      },
      yAxis: {
        title: {
          text: " VNĐ",
        },
      },
      tooltip: {
        valueSuffix: " VNĐ",
      },
      series: [],
    };

    this.getTotalYearGrossInTour();
    this.getTotalYearGrossInStayingService();
    this.getTotalYearGrossInMovingService();
  }

  loadTourColChart(): void {
    this.colChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Thống kê giao dịch trong tháng",
      },
      subtitle: {
        text: "Tổng doanh thu trong tháng",
      },
      xAxis: {
        categories: ["Trong tháng"],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "VNĐ",
        },
      },
      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} VNĐ</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [],
    };

    this.colChartOptionsTemp = this.colChartOptions;
    Highcharts.chart("col-tour-chart", this.colChartOptionsTemp);

    this.getTotalMonthGrossInTour();
  }

  loadStayingColChart(): void {
    this.colStayingChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Thống kê đặt phòng trong tháng",
      },
      subtitle: {
        text: "Tổng doanh thu trong tháng",
      },
      xAxis: {
        categories: ["Trong tháng"],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "VNĐ",
        },
      },
      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} VNĐ</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [],
    };

    this.colStayingChartOptionsTemp = this.colStayingChartOptions;
    Highcharts.chart("col-staying-chart", this.colStayingChartOptionsTemp);

    this.getTotalMonthGrossInStayingService();
  }

  loadMovingColChart(): void {
    this.colMovingChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Thống kê vé di chuyển trong tháng",
      },
      subtitle: {
        text: "Tổng doanh thu trong tháng",
      },
      xAxis: {
        categories: ["Trong tháng"],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "VNĐ",
        },
      },
      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} VNĐ</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [],
    };

    this.colMovingChartOptionsTemp = this.colMovingChartOptions;
    Highcharts.chart("col-moving-chart", this.colMovingChartOptionsTemp);

    this.getTotalMonthGrossInMovingService();
  }

  loadTourPieChart(): void {
    this.pieTourChartOptions = {
      chart: {
        plotShadow: false,
      },
      title: {
        text: "Doanh thu vé tour trong tháng",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {},
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Tổng vé tour tháng",
          data: [],
        },
      ],
    };

    this.pieTourChartOptionsTemp = this.pieTourChartOptions;
    Highcharts.chart("pie-tour-chart", this.pieTourChartOptionsTemp);

    this.getTotalMonthTicketInTour();
  }

  loadMovingPieChart(): void {
    this.pieMovingChartOptions = {
      chart: {
        plotShadow: false,
      },
      title: {
        text: "Doanh thu vé di chuyển trong tháng",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {},
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Tổng vé tháng",
          data: [],
        },
      ],
    };

    this.pieMovingChartOptionsTemp = this.pieMovingChartOptions;
    Highcharts.chart("pie-moving-chart", this.pieMovingChartOptionsTemp);

    this.getTotalMonthTicketInMovingService();
  }

  loadStayingPieChart(): void {
    this.pieStayingChartOptions = {
      chart: {
        plotShadow: false,
      },
      title: {
        text: "Doanh thu book nhà nghỉ trong tháng",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {},
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Tổng vé tháng",
          data: [],
        },
      ],
    };

    this.pieStayingChartOptionsTemp = this.pieStayingChartOptions;
    Highcharts.chart("pie-staying-chart", this.pieStayingChartOptionsTemp);

    this.getTotalMonthTicketInStayingService();
  }

  getTotalYearGrossInTour() {
    this.http
      .get("/api/GetFullReceipt/tourish-plan/total-month-gross")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          let tourChartData: ChartData = {
            name: "Tour du lịch",
            data: [],
          };

          const now = new Date();
          const month = now.getMonth() + 1;

          const grossArray = res.data as MonthlyGross[];

          for (let i = 1; i <= month; i++) {
            const existIndex = grossArray.findIndex(
              (entity) => entity.month == i
            );
            if (existIndex > -1) {
              tourChartData.data.push(grossArray[existIndex].gross);
            } else tourChartData.data.push(0);
          }

          this.lineChartOptions.series.push(tourChartData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalYearGrossInStayingService() {
    this.http
      .get("/api/GetFullReceipt/staying-schedule/total-month-gross")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          let tourChartData: ChartData = {
            name: "Book khách sạn/Homestay",
            data: [],
          };

          const now = new Date();
          const month = now.getMonth() + 1;

          const grossArray = res.data as MonthlyGross[];

          for (let i = 1; i <= month; i++) {
            const existIndex = grossArray.findIndex(
              (entity) => entity.month == i
            );
            if (existIndex > -1) {
              tourChartData.data.push(grossArray[existIndex].gross);
            } else tourChartData.data.push(0);
          }

          this.lineChartOptions.series.push(tourChartData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalYearGrossInMovingService() {
    this.http
      .get("/api/GetFullReceipt/moving-schedule/total-month-gross")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          let tourChartData: ChartData = {
            name: "Vé di chuyển",
            data: [],
          };

          const now = new Date();
          const month = now.getMonth() + 1;

          const grossArray = res.data as MonthlyGross[];

          for (let i = 1; i <= month; i++) {
            const existIndex = grossArray.findIndex(
              (entity) => entity.month == i
            );
            if (existIndex > -1) {
              tourChartData.data.push(grossArray[existIndex].gross);
            } else tourChartData.data.push(0);
          }

          this.lineChartOptions.series.push(tourChartData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalMonthGrossInTour() {
    this.http
      .get("/api/GetFullReceipt/gross-tour")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          const grossArray = res.data as InMonthGross[];

          for (let i = 0; i < grossArray.length; i++) {
            let tourChartData: ChartData = {
              name: grossArray[i].name,
              data: [grossArray[i].gross],
            };

            this.colChartOptions.series.push(tourChartData);
          }

          this.colChartOptionsTemp = this.colChartOptions;
          Highcharts.chart("col-tour-chart", this.colChartOptionsTemp);
        }
      });
  }

  getTotalMonthGrossInStayingService() {
    this.http
      .get("/api/GetFullReceipt/gross-staying-service")
      .subscribe((res: any) => {
        if (res) {
          const grossArray = res.data as InMonthGross[];

          for (let i = 0; i < grossArray.length; i++) {
            let grossData: ChartData = {
              name: grossArray[i].name,
              data: [grossArray[i].gross],
            };

            this.colStayingChartOptions.series.push(grossData);
          }

          this.colStayingChartOptionsTemp = this.colStayingChartOptions;
          Highcharts.chart(
            "col-staying-chart",
            this.colStayingChartOptionsTemp
          );
        }
      });
  }

  getTotalMonthGrossInMovingService() {
    this.http
      .get("/api/GetFullReceipt/gross-moving-service")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          const grossArray = res.data as InMonthGross[];

          for (let i = 0; i < grossArray.length; i++) {
            let grossData: ChartData = {
              name: grossArray[i].name,
              data: [grossArray[i].gross],
            };

            this.colMovingChartOptions.series.push(grossData);
          }

          this.colMovingChartOptionsTemp = this.colMovingChartOptions;
          Highcharts.chart("col-moving-chart", this.colMovingChartOptionsTemp);
        }
      });
  }

  getTotalMonthTicketInTour() {
    this.http
      .get("/api/GetFullReceipt/total-ticket-tour")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          const ticketArray = res.data as InMonthTicket[];

          const sumTicket = ticketArray.reduce(
            (sum, item) => sum + item.totalTicket,
            0
          );

          for (let i = 0; i < ticketArray.length; i++) {
            const percentage = ticketArray[i].totalTicket / sumTicket;
            const name =
              ticketArray[i].name +
              ", tổng cộng " +
              ticketArray[i].totalTicket +
              " người đặt";

            this.pieTourChartOptions.series[0].data.push([name, percentage]);
          }

          this.pieTourChartOptionsTemp = this.pieTourChartOptions;
          Highcharts.chart("pie-tour-chart", this.pieTourChartOptionsTemp);
        }
      });
  }

  getTotalMonthTicketInMovingService() {
    this.http
      .get("/api/GetFullReceipt/total-ticket-moving-service")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          const ticketArray = res.data as InMonthTicket[];

          const sumTicket = ticketArray.reduce(
            (sum, item) => sum + item.totalTicket,
            0
          );

          for (let i = 0; i < ticketArray.length; i++) {
            const percentage = ticketArray[i].totalTicket / sumTicket;
            const name =
              ticketArray[i].name +
              ", tổng cộng " +
              ticketArray[i].totalTicket +
              " người đặt";

            this.pieMovingChartOptions.series[0].data.push([name, percentage]);
          }

          this.pieMovingChartOptionsTemp = this.pieMovingChartOptions;
          Highcharts.chart("pie-moving-chart", this.pieMovingChartOptionsTemp);
        }
      });
  }

  getTotalMonthTicketInStayingService() {
    this.http
      .get("/api/GetFullReceipt/total-ticket-staying-service")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          const ticketArray = res.data as InMonthTicket[];

          const sumTicket = ticketArray.reduce(
            (sum, item) => sum + item.totalTicket,
            0
          );

          for (let i = 0; i < ticketArray.length; i++) {
            const percentage = ticketArray[i].totalTicket / sumTicket;
            const name =
              ticketArray[i].name +
              ", tổng cộng " +
              ticketArray[i].totalTicket +
              " người đặt";

            this.pieStayingChartOptions.series[0].data.push([name, percentage]);
          }

          this.pieStayingChartOptionsTemp = this.pieStayingChartOptions;
          Highcharts.chart(
            "pie-staying-chart",
            this.pieStayingChartOptionsTemp
          );
        }
      });
  }

  getUpaidClientInTour() {
    this.http
      .get("/api/GetFullReceipt/tour/unpaid-client")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.tourUnpaidGroup = res.data;
        }
      });
  }

  getUpaidClientInMoving() {
    this.http
      .get("/api/GetFullReceipt/moving-schedule/unpaid-client")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.movingUnpaidGroup = res.data;
        }
      });
  }

  getUpaidClientInStaying() {
    this.http
      .get("/api/GetFullReceipt/staying-schedule/unpaid-client")
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this.stayingUnpaidGroup = res.data;
        }
      });
  }

  calculatePrice(guest: UnpaidGuest) {
    const price =
      (guest.totalTicket + guest.totalChildTicket / 2) *
        guest.originalPrice *
        (1 - guest.discountFloat) -
      guest.discountAmount;
    return price;
  }
}
