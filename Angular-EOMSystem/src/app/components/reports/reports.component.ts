import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

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
