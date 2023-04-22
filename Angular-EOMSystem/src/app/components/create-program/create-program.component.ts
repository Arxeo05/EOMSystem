import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.css'],
})
export class CreateProgramComponent implements OnInit {
  public form = {
    title: null,
    startDate: null,
    endDate: null,
    place: null,
    leaderId: null,
    additionalDetail: null,
  };

  leaderChoices: any;

  constructor(private backend: BackendService) {}
  error: any[] = [];
  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
  }
  createProgram() {
    console.log(this.form);
    this.backend.createProgram(this.form).subscribe({
      next: (data) => console.log(data),
      error: (error) => this.handleError(error),
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
}
