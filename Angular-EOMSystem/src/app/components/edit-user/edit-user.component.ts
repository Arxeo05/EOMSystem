import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  public form = {
    name: '',
    birthday: '',
    college: '',
    department: '',
    email: '',
    status: 'pending',
    photo: null,
  };
  constructor(private backend: BackendService, private route: ActivatedRoute) {}

  id = Number(this.route.snapshot.paramMap.get('id'));
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
    formData.append('status', this.form.status);
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }

    return this.backend.editUser(formData, this.id).subscribe({
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
