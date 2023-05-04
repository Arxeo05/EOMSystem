import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Chart } from 'angular-highcharts';
import { AuthService } from '../../services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  template: ` <button (click)="add()">Add Point!</button>
    <div [chart]="chart"></div>`,
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private backend: BackendService,
    private auth: AuthService,
    private swal: SwalService
  ) {}
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  isAdmin = false;
  programs: any[] = [];
  searchValue: any;
  notification: any;
  loggedIn: boolean = false;
  loading: boolean = true;
  loading1: boolean = true;
  facultyCount: number = 0;
  pendingUserCount: number = 0;
  activeProgramsCount: number = 0;
  completedProgramsCount: number = 0;
  partnersCount: number = 0;
  //faculty properties
  leadPrograms: any[] = [];
  searchedPrograms: any[] = [];
  memberPrograms: any[] = [];
  exmoas: any[] = [];
  leaderChoices: any;
  leaderValue: any;
  subscriptions: Subscription[] = [];

  data: any[] = [{ name: '', y: null }];

  ngOnInit(): void {
    const sub1 = this.backend.facultyCount().subscribe({
      next: (data: any) => {
        this.facultyCount = data;
        this.data.push({ name: 'Faculty', y: data });
      },
    });
    const sub2 = this.backend.partnersCount().subscribe({
      next: (data: any) => {
        this.partnersCount = data;
        this.data.push({ name: 'Partners', y: data });
      },
    });
    const sub3 = this.backend.pendingUsersCount().subscribe({
      next: (data: any) => {
        this.pendingUserCount = data;
        this.data.push({ name: 'Pending Users', y: data });
      },
    });
    this.subscriptions.push(sub3);
    const sub4 = this.backend.activeProgramsCount().subscribe({
      next: (data: any) => {
        this.activeProgramsCount = data;
        this.data.push({ name: 'Active Programs', y: data });
      },
    });
    const sub5 = this.backend.pastProgramsCount().subscribe({
      next: (data: any) => {
        this.completedProgramsCount = data;
        this.data.push({ name: 'Past Programs', y: data });
      },
    });
    const sub6 = this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    const sub7 = this.backend.programs().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
    const sub8 = this.backend.expiringMoa().subscribe({
      next: (data) => {
        this.exmoas = Object.values(data);
        console.log(data);
      },
      error: (error) => console.log(error),
    });
    this.notify(true);
    const sub9 = this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    const sub10 = this.backend.programByLeader().subscribe((data) => {
      this.leadPrograms = Object.values(data);
    });
    const sub11 = this.backend.programBymember().subscribe((data) => {
      this.memberPrograms = Object.values(data);
    });
    const sub12 = this.auth.authStatus.subscribe((value) => {
      this.loggedIn = value;
    });
    const sub13 = this.backend
      .userRole()
      .subscribe((data: { role: number }) => {
        if (data.role === 1) {
          this.isAdmin = true;
        }
      });
    this.loading = false;
    setTimeout(() => {  
      /** spinner ends after 5 seconds */  
      this.loading1=false;  
  }, 8000);  
    this.subscriptions.push(sub1);
    this.subscriptions.push(sub2);
    this.subscriptions.push(sub3);
    this.subscriptions.push(sub4);
    this.subscriptions.push(sub5);
    this.subscriptions.push(sub6);
    this.subscriptions.push(sub7);
    this.subscriptions.push(sub8);
    this.subscriptions.push(sub9);
    this.subscriptions.push(sub10);
    this.subscriptions.push(sub11);
    this.subscriptions.push(sub12);
    this.subscriptions.push(sub13);
  }

  search() {
    const sub14 = this.backend.searchProgram(this.searchValue).subscribe({
      next: (data) => (this.searchedPrograms = Object.values(data)),
    });
    this.subscriptions.push(sub14);
  }
  filterByLeader() {
    const sub15 = this.backend.filterByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
    this.subscriptions.push(sub15);
  }

  onSearchInputChange() {
    if (this.searchValue === '') {
      const sub16 = this.backend.programs().subscribe({
        next: (data) => (this.programs = Object.values(data)),
      });
      this.subscriptions.push(sub16);
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
    const sub17 = this.backend.deleteProgram(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
    this.subscriptions.push(sub17);
  }

  chart = new Chart({
    chart: {
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: '',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
          style: {
            color: 'black',
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Browser share',
        data: this.data,
      },
    ],
  });
}
// add point to chart serie
