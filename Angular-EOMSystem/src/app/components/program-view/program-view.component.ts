import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.css'],
})
export class ProgramViewComponent implements AfterViewInit {
  programs: any;
  programLeader: any;
  programMembers: any;
  programPartners: any;
  programParticipants: any;
  programFiles: any[] = [];
  isAdmin: boolean = false;

  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngAfterViewInit(): void {
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
    });

    this.programMember(id);
    this.programPartner(id);
    this.programParticipant(id);
    this.programFile(id);
  }
  programsById(id: number): void {
    this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = data),
    });
  }
  programMember(pid: number) {
    this.backend.programMember(pid).subscribe({
      next: (data) => (this.programMembers = data),
    });
  }

  programPartner(pid: number) {
    this.backend.programPartners(pid).subscribe({
      next: (data) => {
        this.programPartners = Object.values(data);
      },
    });
  }

  moaFile: string = '';
  partnerMoa(index: number) {
    this.backend.getMoa(this.programPartners[index].MoaFile).subscribe({
      next: (data) => {
        this.moaFile = window.URL.createObjectURL(data);
      },
    });
  }

  programParticipant(pid: number) {
    this.backend.programParticipants(pid).subscribe({
      next: (data) => (this.programParticipants = data),
    });
  }

  programFile(pid: number) {
    this.backend.programFiles(pid).subscribe({
      next: (data) => {
        this.programFiles = Object.values(data);
      },
    });
  }
  fileUrl: string = '';
  programFilelink(index: number) {
    this.backend.getFile(this.programFiles[index].file).subscribe({
      next: (data) => {
        this.fileUrl = window.URL.createObjectURL(data);
      },
    });
  }

  deleteMember(pid: number, uid: number) {
    this.backend.deleteMember(pid, uid).subscribe({
      next: (data) => console.log(data),
    });
  }
  deletePartner(id: number) {
    this.backend.deletePartner(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteParticipant(id: number) {
    this.backend.deleteParticipant(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteFile(id: number) {
    this.backend.deleteFile(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  // reportData: any = 'FUCK ME'; // Replace with your report data

  // downloadPDF() {
  //   const reportElement = document.getElementById('title');

  //   // Compile the HTML template with Handlebars

  //   // Generate a PDF document from the rendered HTML
  //   if (reportElement instanceof HTMLElement) {
  //     html2canvas(reportElement).then((canvas) => {
  //       const doc = new jsPDF();
  //       doc.text('HELLO', 10, 20); // Add the report data as text to the PDF
  //       doc.save('report.pdf');
  //     });
  //   } else {
  //     console.error('Report element not found');
  //   }
  // }
}
