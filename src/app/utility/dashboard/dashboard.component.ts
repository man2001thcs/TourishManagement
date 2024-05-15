import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { ChartConfig } from "src/app/model/baseModel";

export interface InMonthGross {
  name: string;
  gross: number;
}

export interface MonthlyGross {
  month: number;
  year: number;
  gross: number;
}

export interface GrossData {
  name: string;
  data: number[];
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

  pieChartOptions!: ChartConfig;
  pieChartOptionsTemp: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLineChart();
    this.loadColChart();
    this.loadPieChart();

    this.loadStayingColChart();
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

  loadColChart(): void {
    this.colChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Thống kê giao dịch theo tháng",
      },
      subtitle: {
        text: "Tổng doanh thu trong tháng",
      },
      xAxis: {
        categories: ["Jan"],
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
          '<td style = "padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
      series: [{ name: "Máy POS giao dịch tầng 1", data: [45] }],
    };

    this.colChartOptionsTemp = this.colChartOptions;
    Highcharts.chart("col-chart", this.colChartOptionsTemp);

    // this.getTotalMonthGrossInTour();
  }

  loadStayingColChart(): void {
    this.colStayingChartOptions = {
      chart: {
        type: "column",
      },
      title: {
        text: "Thống kê đặt phòng theo tháng",
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
          '<td style = "padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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

  loadPieChart(): void {
    this.pieChartOptions = {
      chart: {
        plotShadow: false,
      },
      title: {
        text: "Tổng hợp giao dịch trong hệ thống",
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
            format: "<b>{point.name}%</b>: {point.percentage:.1f} %",
            style: {},
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Giao dịch",
          data: [
            ["Máy POS giao dịch tầng 1", 45],
            ["Máy POS giao dịch tầng 2", 10],
            ["Máy POS giao dịch tầng 3", 20],
            ["Máy POS giao dịch tầng 4", 30],
          ],
        },
      ],
    };

    this.pieChartOptionsTemp = this.pieChartOptions;
    Highcharts.chart("pie-chart", this.pieChartOptionsTemp);
  }

  getTotalYearGrossInTour() {
    this.http
      .get("/api/GetFullReceipt/tourish-plan/total-month-gross")
      .subscribe((res: any) => {
        if (res) {
          let tourGrossData: GrossData = {
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
              tourGrossData.data.push(grossArray[existIndex].gross);
            } else tourGrossData.data.push(0);
          }

          this.lineChartOptions.series.push(tourGrossData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalYearGrossInStayingService() {
    this.http
      .get("/api/GetFullReceipt/staying-schedule/total-month-gross")
      .subscribe((res: any) => {
        if (res) {
          let tourGrossData: GrossData = {
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
              tourGrossData.data.push(grossArray[existIndex].gross);
            } else tourGrossData.data.push(0);
          }

          this.lineChartOptions.series.push(tourGrossData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalYearGrossInMovingService() {
    this.http
      .get("/api/GetFullReceipt/moving-schedule/total-month-gross")
      .subscribe((res: any) => {
        if (res) {
          let tourGrossData: GrossData = {
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
              tourGrossData.data.push(grossArray[existIndex].gross);
            } else tourGrossData.data.push(0);
          }

          this.lineChartOptions.series.push(tourGrossData);

          this.lineChartOptionsTemp = this.lineChartOptions;
          Highcharts.chart("line-chart", this.lineChartOptionsTemp);
        }
      });
  }

  getTotalMonthGrossInTour() {
    this.http.get("/api/GetFullReceipt/gross-tour").subscribe((res: any) => {
      if (res) {
        console.log(res);

        const grossArray = res.data as InMonthGross[];

        for (let i = 1; i <= grossArray.length; i++) {
          let tourGrossData: GrossData = {
            name: grossArray[i].name,
            data: [grossArray[i].gross],
          };

          this.colChartOptions.series.push(tourGrossData);
        }

        this.lineChartOptionsTemp = this.lineChartOptions;
        Highcharts.chart("col-chart", this.lineChartOptionsTemp);
      }
    });
  }

  getTotalMonthGrossInStayingService() {
    this.http.get("/api/GetFullReceipt/gross-staying-service").subscribe((res: any) => {
      if (res) {
        console.log(res);

        const grossArray = res.data as InMonthGross[];

        for (let i = 0; i < grossArray.length; i++) {
          let tourGrossData: GrossData = {
            name: grossArray[i].name,
            data: [grossArray[i].gross],
          };

          this.colStayingChartOptions.series.push(tourGrossData);
        }

        this.colStayingChartOptionsTemp = this.colStayingChartOptions;
        Highcharts.chart("col-staying-chart", this.colStayingChartOptionsTemp);
      }
    });
  }
}
