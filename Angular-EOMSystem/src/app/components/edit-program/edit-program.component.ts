import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/services/swal.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css'],
})
export class EditProgramComponent implements AfterViewInit {
  @ViewChild('programForm') myForm!: NgForm;

  canLeave = false;
  submit = false;
  formValues: any;
  public form = {
    title: null,
    startDate: null,
    endDate: null,
    place: null,
    leaderId: null,
    additionalDetail: null,
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private swal: SwalService
  ) {}
  ngAfterViewInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.backend.programsById(id).subscribe({
      next: (data) => {
        this.formValues = Object.values(data);
        this.form.title = this.formValues[0].title;
        this.form.startDate = this.formValues[0].startDate;
        this.form.endDate = this.formValues[0].endDate;
        this.form.place = this.formValues[0].place;
        this.form.leaderId = this.formValues[0].leaderId;
        this.form.additionalDetail = this.formValues[0].additionalDetail;
      },
    });
    if (this.myForm) {
      this.myForm.valueChanges!.subscribe(() => {
        this.canLeave = this.myForm.dirty!;
      });
    }
  }
  leaderChoices: any;
  id = Number(this.route.snapshot.paramMap.get('id'));
  editProgram() {
    console.log(this.form);
    this.submit = true;
    this.backend.editProgram(this.form, this.id).subscribe({
      next: (data) => {
        this.swal.swalSucces('Edit Successful');
        console.log(data);
      },
      error: (error) => {
        this.swal.swalSucces('Edit Successful');
        this.handleError(error);
      },
    });
  }
  handleError(error: any) {}
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
