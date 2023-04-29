import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Chart } from 'angular-highcharts';
import { AuthService } from '../../services/auth.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  template: ` <button (click)="add()">Add Point!</button>
    <div [chart]="chart"></div>`,
})
export class DashboardComponent implements OnInit {
  constructor(
    private backend: BackendService,
    private auth: AuthService,
    private swal: SwalService) {}

  isAdmin = false;
  programs: any[] = [];
  searchValue: any;
  notification: any;
  loggedIn: boolean = false;
  loading: boolean = true;

  //faculty properties
  leadPrograms: any[] = [];
  searchedPrograms: any[] = [];
  memberPrograms: any[] = [];
  exmoas: any[] = [];
  leaderChoices: any;
  leaderValue: any;
  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    this.backend.programs().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
    this.backend.expiringMoa().subscribe({
      next: (data) => (this.exmoas = Object.values(data)),
      error: (error) => console.log(error),
    });
    this.notify(true);
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    this.backend.programByLeader().subscribe((data) => {
      this.leadPrograms = Object.values(data);
    });
    this.backend.programBymember().subscribe((data) => {
      this.memberPrograms = Object.values(data);
    });
    this.auth.authStatus.subscribe((value) => {
      this.loggedIn = value;
    });
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    this.loading = false;
  }

  search() {
    this.backend.searchProgram(this.searchValue).subscribe({
      next: (data) => (this.searchedPrograms = Object.values(data)),
    });
  }
  filterByLeader() {
    this.backend.filterByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  onSearchInputChange() {
    if (this.searchValue === '') {
      this.backend.programs().subscribe({
        next: (data) => (this.programs = Object.values(data)),
      });
    } else {
      this.search();
    }
  }

  notify(boolean: Boolean): any {
    const announcement = document.getElementById('announcement');
    if (!boolean) {
      announcement?.remove();
    }
    return (this.notification =
      'You have 30 days remaining before your partnership with BSU expires');
  }

  deleteProgram(id: number) {
    this.backend.deleteProgram(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
  }
  chart = new Chart({
    chart: {
      type: 'line',
    },
    title: {
      text: 'Linechart',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      title: {
        text: 'Sample',
      },
    },
    series: [
      {
        name: 'Sample',
        type: 'line',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    ],
  });

  // add point to chart serie
  add() {
    this.chart.addPoint(Math.floor(Math.random() * 10));
  }
}
