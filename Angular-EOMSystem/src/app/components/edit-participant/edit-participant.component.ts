import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BackendService } from '../../services/backend.service';
import { SwalService } from 'src/app/services/swal.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-participant',
  templateUrl: './edit-participant.component.html',
  styleUrls: ['./edit-participant.component.css'],
})
export class EditParticipantComponent implements AfterViewInit {
  @ViewChild('participantForm') myForm!: NgForm;

  canLeave = false;
  submit = false;
  formValues: any;
  public form = {
    name: '',
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private location: Location,
    private swal: SwalService
  ) {}
  ngAfterViewInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.backend.getPArticipantById(id).subscribe({
      next: (data) => {
        this.formValues = Object.values(data);
        this.form.name = this.formValues[0].name;
      },
    });
    if (this.myForm) {
      this.myForm.valueChanges!.subscribe(() => {
        this.canLeave = this.myForm.dirty!;
      });
    }
  }
  id = Number(this.route.snapshot.paramMap.get('id'));

  error: any = [];
  private editSub: Subscription = new Subscription();
  editParticipant() {
    this.submit = true;
    const formData = new FormData();
    formData.append('name', this.form.name);

    this.editSub = this.backend.editParticipant(formData, this.id).subscribe({
      next: (data) => {
        this.swal.swalSucces('Edit Successful');
        console.log(data);
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

  goBack(): void {
    this.location.back();
  }
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
