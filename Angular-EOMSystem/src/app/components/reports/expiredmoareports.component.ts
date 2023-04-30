import { Component, OnInit } from "@angular/core";
import jsPDF from 'jspdf';
import { BackendService } from "src/app/services/backend.service";

@Component({
  selector: 'expired-moa',
  template: `
  <div class="filter-container">
      <select class="form-control">
        <option>
          Extension Partner Name
        </option>
        <option>
          Start Date
        </option>
        <option>
          End Date
        </option>
      </select>
      <button class="btn btn-primary" id="leaderFilter" name="leaderFilter">
        Sort
      </button>
    </div>
    <button class="btn btn-primary generate" (click)="onGenerateExpiredMoaList()">
      Generate List
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

  partnersWithActiveMoa: any;
  partnersWithExpiredMoa: any;

  ngOnInit(): void {
    this.getProgramPartnersWithExpiredMoa();
  }

  getProgramPartnersWithExpiredMoa() {
    this.backend.programPartnersWithExpiredMoa().subscribe({
      next: (data) => {
        this.partnersWithExpiredMoa = data;
      },
    });
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
