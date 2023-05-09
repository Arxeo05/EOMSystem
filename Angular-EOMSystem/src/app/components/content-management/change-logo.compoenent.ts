import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-change-logo',
  template: `
              <div class="mb-3">
              <label for="photo" class="form-label" id="photo">Change Logo</label>
              <input
                type="file"
                class="form-control"
                id="photo"
                name="photo"
                [(ngModel)]="form.photo"
                required
                (change)="onFileChange($event)"
              />
            </div>
            <div
              class="alert alert-danger"
              role="alert"
              [hidden]="!error.photo"
            >
              {{ error.photo }}
            </div>
  `,
  styles: [`
  form{
    position: relative;
}

form input{
    width: 100%;
    padding: 15px 15px 7px;
}
  form input:focus{
    border: 2px solid blueviolet;
 }

 form input:focus ~ label{
    top: 6px;
 }
 form label#photo{
    position: absolute;
    left: 15px;
    top: 315px;
    font-size: 12px;
    color: black;
 }
  `]
})
export class ChangeLogoComponent implements OnInit {
  profileValues: any;
  public form = {
    photo: null,
  };
  constructor(private backend: BackendService, private swal: SwalService) {}
  ngOnInit(): void {
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
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }

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
}
