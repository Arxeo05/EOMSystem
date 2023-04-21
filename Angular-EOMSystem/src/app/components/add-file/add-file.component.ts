import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css'],
})
export class AddFileComponent {
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
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

  addFile() {
    const formData = new FormData();
    if (this.form.file) {
      formData.append('file', this.form.file);
    }

    return this.backend.addFile(formData, this.id).subscribe({
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