import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public form = {
    email: null,
    password: null,
  };

  constructor(
    private backend: BackendService,
    private token: TokenService,
    private router: Router,
    private auth: AuthService,
    private swal: SwalService
  ) {}

  error: any = null;
  submitLogin() {
    return this.backend.login(this.form).subscribe({
      next: (data) => {
        this.handleResponse(data);
        this.swal.swalSucces('Login Successful');
      },
      error: (error) => {
        this.handleError(error);
        this.swal.swalError('Something Went Wrong');
      },
    });
  }

  handleResponse(data: any) {
    this.token.handle(data.access_token);
    this.auth.changeAuthStatus(true);
    this.router.navigateByUrl('dashboard');
  }
  handleError(error: any) {
    this.error = error.error.error;
    console.log(this.error);
  }
}
