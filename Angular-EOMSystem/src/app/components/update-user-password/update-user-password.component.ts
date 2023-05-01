import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/services/swal.service';
@Component({
  selector: 'app-update-user-password',
  templateUrl: './update-user-password.component.html',
  styleUrls: ['./update-user-password.component.css'],
})
export class UpdateUserPasswordComponent {
  public form = {
    password: '',
    password_confirmation: '',
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private swal: SwalService) {}
  error: any = [];
  id = Number(this.route.snapshot.paramMap.get('id'));
  updateUserPassword() {
    const formData = new FormData();
    formData.append('password', this.form.password);
    formData.append('password_confirmation', this.form.password_confirmation);

    return this.backend.updateUserPassowrd(formData, this.id).subscribe({
      next: (data) => {
        this.swal.swalSucces('Edit Successful')
        console.log(data);
      },
      error: (error) => {
        this.swal.swalError("Something Went Wrong")
        this.handleError(error);
      },
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
}
