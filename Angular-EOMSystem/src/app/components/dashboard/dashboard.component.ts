import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private backend: BackendService) {}

  isAdmin = false;
  programs: any[] = [];
  notification: any;

  //faculty properties
  leadPrograms: any[] = [];
  memberPrograms: any[] = [];

  ngOnInit(): void {
    this.backend.programs().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
    this.notify(true);
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    this.backend.programByLeader().subscribe((data) => {
      this.leadPrograms = Object.values(data);
    });
    this.backend.programBymember().subscribe((data) => {
      this.memberPrograms = Object.values(data);
    });
  }

  notify(boolean: Boolean): any {
    const announcement = document.getElementById('announcement');
    if (!boolean) {
      announcement?.remove();
    }
    return (this.notification =
      'You have 30 days remaining before your partnership with BSU expires');
  }

  deleteProgram(id: number) {
    this.backend.deleteProgram(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
  }
}
