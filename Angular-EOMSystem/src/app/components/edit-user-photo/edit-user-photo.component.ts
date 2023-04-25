import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-user-photo',
  templateUrl: './edit-user-photo.component.html',
  styleUrls: ['./edit-user-photo.component.css'],
})
export class EditUserPhotoComponent {
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  public form = {
    photo: null,
  };
  id = Number(this.route.snapshot.paramMap.get('id'));

  error: any = [];
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.photo = event.target.files[0];
    } else {
      this.form.photo = null;
    }
  }
  editUser() {
    const formData = new FormData();
    if (this.form.photo) {
      formData.append('photo', this.form.photo);
    }

    return this.backend.editUserPhoto(formData, this.id).subscribe({
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
