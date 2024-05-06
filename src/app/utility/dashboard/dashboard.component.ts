import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  lineChartOptions: any;
  colChartOptions: any;
  pieChartOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.loadLineChart();
    this.loadColChart();
    this.loadPieChart();
  }

  loadLineChart(): void {
    this.lineChartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Thống kê giao dịch'
      },
      subtitle: {
        text: 'VNPT PAYMENT'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        title: {
          text: 'Giao dịch'
        }
      },
      tooltip: {
        valueSuffix: 'Giao dịch'
      },
      series: [
        {
          name: 'Máy POS giao dịch tầng 1',
          data: [12, 18, 16, 14, 18, 21, 25, 26, 23, 18, 19, 21]
        },
        {
          name: 'Máy POS giao dịch tầng 2',
          data: [20, 18, 17, 11, 17, 22, 24, 24, 20, 14, 21, 25]
        },
        {
          name: 'Máy POS giao dịch tầng 3',
          data: [9, 6, 16, 20, 15, 17, 18, 17, 14, 9, 19, 10]
        },
        {
          name: 'Máy POS giao dịch tầng 4',
          data: [19, 22, 27, 25, 19, 15, 17, 16, 14, 10, 16, 28]
        }
      ]
    };
    Highcharts.chart('line-chart', this.lineChartOptions);
  }

  loadColChart(): void {
    this.colChartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Thống kê giao dịch theo tháng'
      },
      subtitle: {
        text: 'VNPT PAYMENT'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Giao dịch'
        }
      },
      tooltip: {
        headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Máy POS giao dịch tầng 1',
          data: [12, 18, 16, 14, 18, 21, 25, 26, 23, 18, 19, 21]
        },
        {
          name: 'Máy POS giao dịch tầng 2',
          data: [20, 18, 17, 11, 17, 22, 24, 24, 20, 14, 21, 25]
        },
        {
          name: 'Máy POS giao dịch tầng 3',
          data: [9, 6, 16, 20, 15, 17, 18, 17, 14, 9, 19, 10]
        },
        {
          name: 'Máy POS giao dịch tầng 4',
          data: [19, 22, 27, 25, 19, 15, 17, 16, 14, 10, 16, 28]
        }
      ]
    };
    Highcharts.chart('col-chart', this.colChartOptions);
  }

  loadPieChart(): void {
    this.pieChartOptions = {
      chart: {
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: 'Tổng hợp giao dịch trong hệ thống'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
            style: {}
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Giao dịch',
          data: [
            ['Máy POS giao dịch tầng 1', 45],
            ['Máy POS giao dịch tầng 2', 10],
            ['Máy POS giao dịch tầng 3', 20],
            ['Máy POS giao dịch tầng 4', 30]
          ]
        }
      ]
    };
    Highcharts.chart('pie-chart', this.pieChartOptions);
  }
}
