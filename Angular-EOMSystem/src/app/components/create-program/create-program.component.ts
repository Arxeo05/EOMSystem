import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
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
  invalidDates = false;

  constructor(private backend: BackendService, private router: Router) {}
  error: any[] = [];
  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => {
        this.leaderChoices = data;
      },
    });
  }
  createProgram() {
    console.log(this.form);
    this.backend.createProgram(this.form).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl(`program/${data}/add-member`);
      },
      error: (error) => this.handleError(error),
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
  validateDates() {
    const startDate = this.form.startDate
      ? new Date(this.form.startDate)
      : null;
    const endDate = this.form.endDate ? new Date(this.form.endDate) : null;
    if (startDate && endDate && startDate > endDate) {
      this.invalidDates = true;
    } else {
      this.invalidDates = false;
    }
  }
}
