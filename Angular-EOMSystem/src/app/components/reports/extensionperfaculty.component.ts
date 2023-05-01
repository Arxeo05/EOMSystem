import { Component, OnInit } from "@angular/core";
import jsPDF from 'jspdf';
import { BackendService } from "src/app/services/backend.service";

@Component({
  selector: 'per-faculty',
  template: `
  <div class="filter-container">
    <select
              class="form-control"
              id="leaderId"
              name="leaderId"
              [(ngModel)]="leaderValue"
              requred
            >
            <option *ngFor="let leader of leaderChoices" value="{{ leader.id }}">
                {{ leader.name }}
              </option>
            </select>

            <button
              class="btn btn-primary"
              id="leaderFilter"
              name="leaderFilter"
              (click)="filterByLeader()"
              style="width: 9em"
            >
              Filter By Leader
            </button>
    </div>
    <button class="btn btn-primary generate">
      Download List
    </button>
    <h3>List of Extension per Faculty</h3>
    <div class="perfaculty-container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Extension Partner</th>
            <th scope="col">Faculty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
          </tr>
          <tr>
            <td>Jacob</td>
            <td>Thornton</td>
          </tr>
          <tr>
            <td>Larry</td>
            <td>the Bird</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
  .content {
  display: flex;
  background-color: aliceblue;
  }

  h3 {
  margin: 20px 0 20px 0;
  }

  .perfaculty-container {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 50px;
  margin-left: 10px;
  background-color: rgb(250, 250, 250);
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
export class ExtensionPerFaculty implements OnInit{

  constructor(private backend: BackendService) {}

  programs: any[] = [];
  leaderValue: any;
  leaderChoices: any;

  ngOnInit(): void {
  }

  filterByLeader() {
    this.backend.filterByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  async generateExtensionPerFacultyPDF(htmlContent: string) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    await doc.html(htmlContent, {
      callback: function (doc) {
        doc.save('extensions-list.pdf');
      },
      margin: [15, 15, 15, 15],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 600,
    });
  }

  onGenerateExtensionPerList() {
    const element = document.getElementById('extensionPerFacultyList');
    if (element) {
      const htmlContent = element.innerHTML;
      this.generateExtensionPerFacultyPDF(htmlContent);
    } else {
      console.error('Element with ID "extensionPerFacultyList" not found.');
    }
  }
}
