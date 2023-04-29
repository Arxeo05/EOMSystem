import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';
@Component({
  selector: 'app-moa-renew',
  templateUrl: './moa-renew.component.html',
  styleUrls: ['./moa-renew.component.css'],
})
export class MoaRenewComponent {
  public form = {
    MoaFile: null,
    startPartnership: '',
    endPartnership: '',
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private location: Location,
    private swal: SwalService
  ) {}
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.MoaFile = event.target.files[0];
    } else {
      this.form.MoaFile = null;
    }
  }

  error: any[] = [];
  id = Number(this.route.snapshot.paramMap.get('id'));
  renewPartner() {
    const formData = new FormData();
    formData.append('startPartnership', this.form.startPartnership);
    formData.append('endPartnership', this.form.endPartnership);
    if (this.form.MoaFile) {
      formData.append('MoaFile', this.form.MoaFile);
    }

    return this.backend.renewPartner(formData, this.id).subscribe({
      next: (data: any) => {
        this.swal.swalSucces("Moa Renewed Successfully");
        console.log(data);},
      error: (error: any) => {
        this.swal.swalError('Something Went Wrong');
        this.handleError(error);
      },
    });
  }
  handleError(error: any) {
    this.error = error.error.errors;
  }
  goBack(): void {
    this.location.back();
  }
}
