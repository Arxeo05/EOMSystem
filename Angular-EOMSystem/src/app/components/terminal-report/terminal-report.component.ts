import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import jsPDF from 'jspdf';
import { Location } from '@angular/common';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-terminal-report',
  templateUrl: './terminal-report.component.html',
  styleUrls: ['./terminal-report.component.css'],
})
export class TerminalReportComponent implements OnInit {
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    ) {}
  programs: any;
  programMembers: any;
  programParticipants: any;
  programFlows: any;
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getProgram(id);
    this.programMember(id);
    this.programParticipant(id);
    this.programFlow(id);
  }
  getProgram(id: number): void {
    this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  programMember(pid: number) {
    this.backend.programMember(pid).subscribe({
      next: (data) => (this.programMembers = data),
    });
  }
  programParticipant(pid: number) {
    this.backend.programParticipants(pid).subscribe({
      next: (data) => (this.programParticipants = Object.values(data)),
    });
  }
  programFlow(pid: number) {
    this.backend.programFlow(pid).subscribe({
      next: (data) => (this.programFlows = Object.values(data)),
    });
  }
  async generatePDF(htmlContent: string) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    await doc.html(htmlContent, {
      callback: function (doc) {
        doc.save('terminal-report.pdf');
      },
      margin: [15, 15, 15, 15],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 600,
    });
  }

  onGeneratePDF() {
    const element = document.getElementById('myHtmlElement');
    if (element) {
      const htmlContent = element.innerHTML;
      this.generatePDF(htmlContent);
    } else {
      console.error('Element with ID "myHtmlElement" not found.');
    }
  }

  goBack() {
    this.location.back();
  }
}
