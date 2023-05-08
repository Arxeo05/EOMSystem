import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { SwalService } from 'src/app/services/swal.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements AfterViewInit {
  @ViewChild('userForm') myForm!: NgForm;

  canLeave = false;
  submit = false;

  profileValues: any;
  public form = {
    name: '',
    password: '',
    college: '',
    department: '',
    email: '',
    photo: null,
    birthday: '',
  };
  constructor(private backend: BackendService, private swal: SwalService) {}
  ngAfterViewInit(): void {
    this.backend.me().subscribe({
      next: (data) => {
        this.profileValues = Object.values(data);
        this.form.name = this.profileValues[0].name;
        this.form.birthday = this.profileValues[0].birthday;
        this.form.college = this.profileValues[0].college;
        this.form.department = this.profileValues[0].department;
        this.form.email = this.profileValues[0].email;
        this.form.password = this.profileValues[0].password;
      },
      error: (error) => {
        this.error = Object.values(error);
      },
    });
    if (this.myForm) {
      this.myForm.valueChanges!.subscribe(() => {
        this.canLeave = this.myForm.dirty!;
      });
    }
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.photo = event.target.files[0];
    } else {
      this.form.photo = null;
    }
  }
  error: any = [];
  editUser() {
    this.submit = true;
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('birthday', this.form.birthday);
    formData.append('college', this.form.college);
    formData.append('department', this.form.department);
    formData.append('email', this.form.email);
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }
    formData.append('password', this.form.password);

    return this.backend.editUserprofile(formData).subscribe({
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
