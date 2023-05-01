import { Component, OnInit } from "@angular/core";
import jsPDF from 'jspdf';
import { BackendService } from "src/app/services/backend.service";

@Component({
  selector: 'expired-moa',
  template: `
  <div class="filter-container">
  <select class="form-control" id="sort" [(ngModel)]="filterValue">
        <option default>
          All
        </option>
        <option value="day">
          Per Day
        </option>
        <option value="week">
          Per Week
        </option>
        <option value="month">
          Per Month
        </option>
        <option value="year">
          Per Year
        </option>
      </select>
      <button class="btn" style="background-color: #e2832a; color: white; border: 0px;border-radius: 3px; padding: 7px;" id="filterBy" name="filterBy" (click)="filterBy()">
        Filter
      </button>
    </div>
    <button class="btn btn-primary generate" (click)="onGenerateExpiredMoaList()">
      <b>Download List</b>
    </button>

    <div class="expired-container" id="expiredMoaList">
      <h5>Expired MOA</h5>
      <div></div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Extension Partner</th>
            <th scope="col">Start Date</th>
            <th scope="col">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="partnersWithExpiredMoa.length < 1">
            <td colspan="3">No Expired Moa</td>
          </tr>
        </tbody>
        <tfoot>
          <tr *ngFor="let expiredMoa of partnersWithExpiredMoa">
            <td>{{expiredMoa.name}}</td>
            <td>{{expiredMoa.startPartnership}}</td>
            <td>{{expiredMoa.endPartnership}}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
  styles: [`
  .expired-container {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  margin-left: 10px;
  background-color: rgb(245, 121, 121);
  box-shadow: 5px 5px 5px #939393;
  padding: 20px;
  }

  .filter-container {
  display: flex;
  }

  .generate {
  margin-top: 15px;
  }
  `]
})
export class ExpiredMoaReport implements OnInit{

  constructor(
    private backend: BackendService,) {}

  partnersWithExpiredMoa?: any;
  filterValue: any;

  ngOnInit(): void {
    this.getProgramPartnersWithExpiredMoa();
  }

  getProgramPartnersWithExpiredMoa() {
    this.backend.programPartnersWithExpiredMoa().subscribe({
      next: (data) => {
        this.partnersWithExpiredMoa = Object.values(data);
      },
    });
  }

  filterByDay() {
    this.backend.expiredMoaFilterByDay().subscribe ({
      next: (data) => {
        this.partnersWithExpiredMoa = Object.values(data);
        console.log(this.partnersWithExpiredMoa);
      }
    })
  }

  filterByWeek() {
    this.backend.expiredMoaFilterByWeek().subscribe ({
      next: (data) => {
        this.partnersWithExpiredMoa = Object.values(data);
        console.log(this.partnersWithExpiredMoa);
      }
    })
  }

  filterByMonth() {
    this.backend.expiredMoaFilterByMonth().subscribe ({
      next: (data) => {
        this.partnersWithExpiredMoa = Object.values(data);
        console.log(this.partnersWithExpiredMoa);
      }
    })
  }

  filterByYear() {
    this.backend.expiredMoaFilterByYear().subscribe ({
      next: (data) => {
        this.partnersWithExpiredMoa = Object.values(data);
        console.log(this.partnersWithExpiredMoa);
      }
    })
  }
  filterBy() {
    console.log (this.filterValue);
    if (this.filterValue === undefined || "All") {
      this.getProgramPartnersWithExpiredMoa();
    }
    if (this.filterValue === "day") {
      this.filterByDay();
    }
    if (this.filterValue === "week") {
      this.filterByDay();
    }
    if (this.filterValue === "month") {
      this.filterByDay();
    }
    if (this.filterValue === "year") {
      this.filterByYear();
    }
  }

  async generateExpiredMoaPDF(htmlContent: string) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    await doc.html(htmlContent, {
      callback: function (doc) {
        doc.save('expired-moa-list.pdf');
      },
      margin: [15, 15, 15, 15],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 600,
    });
  }

  onGenerateExpiredMoaList() {
    const element = document.getElementById('expiredMoaList');
    if (element) {
      const htmlContent = element.innerHTML;
      this.generateExpiredMoaPDF(htmlContent);
    } else {
      console.error('Element with ID "expiredMoaList" not found.');
    }
  }

}
