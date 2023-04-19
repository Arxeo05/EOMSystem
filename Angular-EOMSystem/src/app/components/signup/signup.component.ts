import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public form = {
    name: '',
    birthday: '',
    college: '',
    department: '',
    email: '',
    password: '',
    password_confirmation: '',
    photo: null,
  };

  constructor(private backend: BackendService) {}
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.photo = event.target.files[0];
    } else {
      this.form.photo = null;
    }
  }
  error: any = [];
  signupUser() {
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('birthday', this.form.birthday);
    formData.append('college', this.form.college);
    formData.append('department', this.form.department);
    formData.append('email', this.form.email);
    formData.append('password', this.form.password);
    formData.append('password_confirmation', this.form.password_confirmation);
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }

    return this.backend.signup(formData).subscribe({
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
