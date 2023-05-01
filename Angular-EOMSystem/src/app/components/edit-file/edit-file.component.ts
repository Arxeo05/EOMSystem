import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.css'],
})
export class EditFileComponent {
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private swal: SwalService
  ) {}
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  public form = {
    file: null,
  };
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.file = event.target.files[0];
    } else {
      this.form.file = null;
    }
  }

  editFile() {
    const formData = new FormData();
    if (this.form.file) {
      formData.append('file', this.form.file);
    }

    return this.backend.editFile(formData, this.id).subscribe({
      next: (data) => {
        this.swal.swalSucces('Update Successful');
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
