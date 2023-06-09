import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import { BackendService } from "src/app/services/backend.service";

@Component({
  selector: 'per-faculty',
  template: `
  <div class="body">
  <div class="filter-container">
    <select
              class="form-control"
              id="leaderId"
              name="leaderId"
              [(ngModel)]="leaderValue"
              requred
            >
            <option *ngFor="let leader of leaderChoices" value="{{ leader.id }}" id="leaderName">
                {{ leader.name }}
              </option>
            </select>

            <button
              class="btn btn-warning"
              style="background-color: red; color: white; border: 0px;border-radius: 3px; padding: 7px;"
              id="leaderFilter"
              name="leaderFilter"
              (click)="filterByLeader()"
              style="width: 9em"
            >
              Filter By Faculty
            </button>
    </div>
    <button class="btn btn-primary generate" (click)="onGeneratePDF()">
      <b>Download List</b>
    </button>
    <div class="perfaculty-container">
      <h4>Faculty: {{leaderName}}</h4>
      <div id="extensionPerFacultyList">
      <div class="logo-container">
      <img src="assets/images/bsulogo.png" class="logo">
      </div>
      <h3>List of Extension Program per Faculty</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Extension Program</th>
              <th scope="col">Location</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="programs.length < 1">
              <td colspan="4">No Extension Found</td>
            </tr>
          </tbody>
          <tfoot *ngFor="let program of programs">
            <tr>
              <td>{{program.title}}</td>
              <td>{{program.place}}</td>
              <td>{{program.startDate}}</td>
              <td>{{program.endDate}}</td>
            </tr>
          </tfoot>
        </table>
        <div>
          <img src="assets/images/waves.png" class="waves">
        </div>
      </div>
    </div>
    </div>
  `,
  styles: [`

  .body{
    margin: 50px;
  }

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
  box-shadow: 5px 5px 5px #939393;
  padding: 20px;
  }

  .filter-container {
    display: flex;
  }

  .generate {
    margin-top: 15px;
  }

  .logo-container {
  text-align: left;
  background-image: url("../../../assets/images/hexagon.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  height: 100px;
}

.waves {
  width: 100%;
  height: 250px;
}
  `]
})
export class ExtensionPerFaculty implements OnInit{

  constructor(
    private backend: BackendService,
    private route: ActivatedRoute) {}

  programs: any[] = [];
  programLeader: any;
  programMembers: any;
  programPartners: any;
  isAdmin = false;
  loading: boolean = true;
  leaderValue: any;
  leaderChoices: any;
  leadPrograms: any[] = [];
  leaderName:any;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
      this.loading = false;
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    this.backend.programLeader(id).subscribe({
      next: (data) => {
        (this.programLeader = data);
        console.log(this.programLeader);
      },
    });
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    this.programPartner(id);
  }
  programsById(id: number): void {
    this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  filterByLeader() {
    let getLeaderName = document.getElementById("leaderName")?.innerText;
    this.leaderName = getLeaderName;
    console.log(this.leaderName);
    this.backend.filterByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  programPartner(pid: number) {
    this.backend.programPartners(pid).subscribe({
      next: (data) => {
        this.programPartners = Object.values(data);
      },
    });
    this.backend.programs().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  // async generateExtensionPerFacultyPDF(htmlContent: string) {
  //   const doc = new jsPDF({
  //     orientation: 'p',
  //     unit: 'mm',
  //     format: 'a4',
  //     putOnlyUsedFonts: true,
  //   });

  //   await doc.html(htmlContent, {
  //     callback: function (doc) {
  //       doc.save('extensions-list.pdf');
  //     },
  //     margin: [15, 15, 15, 15],
  //     autoPaging: 'text',
  //     x: 0,
  //     y: 0,
  //     width: 190,
  //     windowWidth: 600,
  //   });
  // }

  // onGenerateExtensionPerList() {
  //   const element = document.getElementById('extensionPerFacultyList');
  //   if (element) {
  //     const htmlContent = element.innerHTML;
  //     this.generateExtensionPerFacultyPDF(htmlContent);
  //   } else {
  //     console.error('Element with ID "extensionPerFacultyList" not found.');
  //   }
  // }

  public onGeneratePDF(): void {
    let DATA: any = document.getElementById('extensionPerFacultyList');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 210;
      let fileHeight = 300;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('extensions-list.pdf');
    });
  }
}
