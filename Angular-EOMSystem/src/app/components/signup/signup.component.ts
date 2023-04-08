import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public form = {
    name: null,
    birthday: null,
    college: null,
    department: null,
    email: null,
    password: null,
    password_confirmation: null,
    photo: null,
  };

  constructor(private backend: BackendService) {}
  error: any = [];
  signupUser() {
    console.log(this.form);
    return this.backend.signup(this.form).subscribe({
      next: (data) => console.log(data),
      error: (error) => this.handleError(error),
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
}
