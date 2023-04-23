import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.css'],
})
export class EditUserProfileComponent implements OnInit {
  profileValues: any;
  public form = {
    name: '',
    birthday: '',
    college: '',
    department: '',
    email: '',
    photo: null,
  };
  constructor(private backend: BackendService) {}
  ngOnInit(): void {
    this.backend.me().subscribe({
      next: (data) => {
        this.profileValues = Object.values(data);
        this.form.name = this.profileValues[0].name;
        this.form.birthday = this.profileValues[0].birthday;
        this.form.college = this.profileValues[0].college;
        this.form.department = this.profileValues[0].department;
        this.form.email = this.profileValues[0].email;
      },
      error: (error) => {
        this.error = Object.values(error);
      },
    });
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
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('birthday', this.form.birthday);
    formData.append('college', this.form.college);
    formData.append('department', this.form.department);
    formData.append('email', this.form.email);
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }

    return this.backend.editUserprofile(formData).subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        this.handleError(error);
      },
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
}
