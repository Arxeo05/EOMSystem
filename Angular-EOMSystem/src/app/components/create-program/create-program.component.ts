import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { SwalService } from 'src/app/services/swal.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.css'],
})
export class CreateProgramComponent implements AfterViewInit {
  @ViewChild('programForm') myForm!: NgForm;

  canLeave = false;
  submit = false;

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

  constructor(
    private backend: BackendService,
    private router: Router,
    private swal: SwalService
  ) {}
  error: any[] = [];

  ngAfterViewInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => {
        this.leaderChoices = data;
      },
    });
    if (this.myForm) {
      this.myForm.valueChanges!.subscribe(() => {
        this.canLeave = this.myForm.dirty!;
      });
    }
  }
  createProgram() {
    console.log(this.form);
    this.submit = true;
    this.backend.createProgram(this.form).subscribe({
      next: (data) => {
        console.log(data);
        this.swal.swalSucces('Extension Program Created Successfuly');
        this.router.navigateByUrl(`program/${data}/add-member`);
      },
      error: (error) => {
        this.swal.swalError('Something Went Wrong');
        this.handleError(error);
      },
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
  // canleaveGuard() {
  //   if (this.canLeave && !this.submit) {
  //     const res = confirm('Leave and lose unsaved data?');
  //     if (res) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  canleaveGuard() {
    if (this.canLeave && !this.submit) {
      return Swal.fire({
        title: 'Are you sure you want to leave?',
        text: 'You have unsaved changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        return result.isConfirmed;
      });
    }
    return true;
  }
}
