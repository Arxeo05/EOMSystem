import { Component, OnInit } from "@angular/core";
import jsPDF from 'jspdf';
import { BackendService } from "src/app/services/backend.service";

@Component({
  selector: 'active-moa',
  template: `
  <div class="filter-container">
      <select class="form-control" id="sort">
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
      <button class="btn btn-primary" id="leaderFilter" name="leaderFilter" (click)="sortBy()">
        Sort
      </button>
    </div>
    <button class="btn btn-primary generate" (click)="onGenerateActiveMoaList()">
      Generate List
    </button>
    <div class="active-container" id="activeMoaList">
      <h5>Active MOA</h5>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Extension Partner</th>
            <th scope="col">Start Date</th>
            <th scope="col">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="partnersWithActiveMoa.length < 1">
            <td colspan="3">No Active Moa</td>
          </tr>
        </tbody>
        <tfoot>
          <tr *ngFor="let activeMoa of partnersWithActiveMoa">
            <td>{{activeMoa.name}}</td>
            <td>{{activeMoa.startPartnership}}</td>
            <td>{{activeMoa.endPartnership}}</td>
          </tr>
        </tfoot>
      </table>

    </div>
  `,
  styles: [`
  .active-container {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  margin-left: 10px;
  background-color: rgb(121, 245, 121);
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
export class ActiveMoaReport implements OnInit{

  constructor(
    private backend: BackendService,) {}

  partnersWithActiveMoa: any;
  partnersWithExpiredMoa: any;

  ngOnInit(): void {
    this.getProgramPartnersWithActiveMoa();
  }

  getProgramPartnersWithActiveMoa() {
    this.backend.programPartnersWithActiveMoa().subscribe({
      next: (data) => {
        this.partnersWithActiveMoa = Object.values(data);
        console.log(this.partnersWithActiveMoa)
      },
    });
  }

  async generateActiveMoaPDF(htmlContent: string) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    await doc.html(htmlContent, {
      callback: function (doc) {
        doc.save('active-moa-list.pdf');
      },
      margin: [15, 15, 15, 15],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 600,
    });
  }

  onGenerateActiveMoaList() {
    const element = document.getElementById('activeMoaList');
    if (element) {
      const htmlContent = element.innerHTML;
      this.generateActiveMoaPDF(htmlContent);
    } else {
      console.error('Element with ID "activeMoaList" not found.');
    }
  }

  sortBy() {

  }
}
