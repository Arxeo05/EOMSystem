import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.css'],
})
export class AddFileComponent {
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location
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

  addFile() {
    const formData = new FormData();
    if (this.form.file) {
      formData.append('file', this.form.file);
    }

    return this.backend.addFile(formData, this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.form.file = null;
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([this.router.url]);
          });
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
  cancelStep() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
  goBack() {
    this.location.back();
  }
}
