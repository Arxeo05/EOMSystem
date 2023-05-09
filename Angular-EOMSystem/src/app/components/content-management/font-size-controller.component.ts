import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-font-size-control',
  template: `
    <div>
      <label>Font Size: {{ fontSize }}px</label>
      <br>
      <input type="range" min="12" max="48" step="1" [(ngModel)]="fontSize" (change)="updateFontSize()">
    </div>
  `,
  styles: [`
  `]
})
export class FontSizeControlComponent implements OnInit {
  fontSize: number;

  constructor() {
    this.fontSize = 16;
  }

  ngOnInit() {
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize, 10);
      this.updateFontSize();
    }
  }

  updateFontSize() {
    document.body.style.fontSize = this.fontSize + 'px';
    localStorage.setItem('fontSize', this.fontSize.toString());
  }
}
