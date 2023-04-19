import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent {
  constructor(private backend: BackendService) {}
  exmoas: any[] = [];
  ngOnInit(): void {
    this.backend.expiringMoa().subscribe({
      next: (data) => (this.exmoas = Object.values(data)),
      error: (error) => console.log(error),
    });
  }
}
