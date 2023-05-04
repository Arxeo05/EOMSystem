import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';
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
    private location: Location,
    private swal: SwalService
  ) {}
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  public form = {
    file: null,
  };
  public files: any[] = [];

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.files.push(event.target.files[i]);
      }
    }
  }

  addFile() {
    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('file[]', this.files[i], this.files[i].name);
    }

    return this.backend.addFile(formData, this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.files = [];
        this.swal.swalSucces('Files Added Successfully');
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate([this.router.url]);
          });
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
  cancelStep() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
  goBack() {
    this.location.back();
  }
  home() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
}
