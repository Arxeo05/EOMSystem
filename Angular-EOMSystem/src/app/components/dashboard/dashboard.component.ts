import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private backend: BackendService) {}
  programs: any;
  notification: any;
  ngOnInit(): void {
    this.backend.programs().subscribe({
      next: (data) => (this.programs = data),
    });
    this.notify(true);
  }

  notify(boolean: Boolean): any {
    const announcement = document.getElementById("announcement");
    if (!boolean) {
      announcement?.remove();
    }
    return  this.notification = "You have 30 days remaining before your partnership with BSU expires";
  }
}
