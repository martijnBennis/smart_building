import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-anomalies',
  templateUrl: './find-anomalies.component.html',
  styleUrls: ['./find-anomalies.component.css']
})
export class FindAnomaliesComponent {


  findGraphs: boolean = true;

  constructor() { }

  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Co2'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Temperature'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'PIR Sensor'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Airflow'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Lighstate'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // blue
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(48, 60, 141, 1)',
      pointBackgroundColor: 'rgba(48, 60, 141, 1)',
      pointBorderColor: 'rgba(48, 60, 141, 1)',
      pointHoverBackgroundColor: 'rgba(48, 60, 141, 1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(220, 29, 57,1)',
      pointBackgroundColor: 'rgba(220, 29, 57,1)',
      pointBorderColor: 'rgba(220, 29, 57,1)',
      pointHoverBackgroundColor: 'rgba(220, 29, 57,1)',
      pointHoverBorderColor: 'rgba(220, 29, 57,0.8)'
    },
    { // green
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(241, 177, 52,1)',
      pointBackgroundColor: 'rgba(241, 177, 52,1)',
      pointBorderColor: 'rgba(241, 177, 52,1)',
      pointHoverBackgroundColor: 'rgba(241, 177, 52, 1)',
      pointHoverBorderColor: 'rgba(241, 177, 52, 0.8)'
    },
    { // Purple
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(153,52,179, 1)',
      pointBackgroundColor: 'rgba(153,52,179, 1)',
      pointBorderColor: 'rgba(153,52,179, 1)',
      pointHoverBackgroundColor: 'rgba(153,52,179, 1)',
      pointHoverBorderColor: 'rgba(153,52,179, 0.8)'
    },
    { // light blue
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(59,153,216,1)',
      pointBackgroundColor: 'rgba(59,153,216,1)',
      pointBorderColor: 'rgba(59,153,216,1)',
      pointHoverBackgroundColor: 'rgba(59,153,216,1)',
      pointHoverBorderColor: 'rgba(59,153,216,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }


  generateGraph(){

    this.findGraphs = false;
  }


}
