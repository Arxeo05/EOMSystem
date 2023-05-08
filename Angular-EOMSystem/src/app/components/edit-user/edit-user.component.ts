import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/services/swal.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements AfterViewInit {
  @ViewChild('userForm') myForm!: NgForm;

  canLeave = false;
  submit = false;
  formValues: any;
  photoUrl: string = '';
  public form = {
    name: '',
    birthday: '',
    college: '',
    department: '',
    email: '',
    status: '',
    photo: null,
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private swal: SwalService
  ) {}
  ngAfterViewInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.backend.userById(id).subscribe({
      next: (data) => {
        this.formValues = Object.values(data);
        this.form.name = this.formValues[0].name;
        this.form.birthday = this.formValues[0].birthday;
        this.form.college = this.formValues[0].college;
        this.form.department = this.formValues[0].department;
        this.form.email = this.formValues[0].email;
        this.form.status = this.formValues[0].status;
        this.form.photo = this.formValues[0].photo;

        this.backend.userPhoto(this.formValues[0].photo).subscribe({
          next: (data) => {
            const reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
              this.photoUrl = reader.result as string;
            };
          },
        });
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
  editUser() {
    const formData = new FormData();
    this.submit = true;
    formData.append('name', this.form.name);
    formData.append('birthday', this.form.birthday);
    formData.append('college', this.form.college);
    formData.append('department', this.form.department);
    formData.append('email', this.form.email);
    formData.append('status', this.form.status);

    return this.backend.editUser(formData, this.id).subscribe({
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
