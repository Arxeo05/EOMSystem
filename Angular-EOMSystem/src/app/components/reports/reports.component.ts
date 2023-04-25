import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

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

  onGenerateActiveMoaList() {
    const element = document.getElementById('activeMoaList');
    if (element) {
      const htmlContent = element.innerHTML;
      this.generateActiveMoaPDF(htmlContent);
    } else {
      console.error('Element with ID "activeMoaList" not found.');
    }
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
