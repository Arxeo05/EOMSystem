import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css'],
})
export class AddPartnerComponent {
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  public form = {
    name: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    MoaFile: null,
    startPartnership: '',
    endPartnership: '',
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    public router: Router,
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

  addPartner() {
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('address', this.form.address);
    formData.append('contactPerson', this.form.contactPerson);
    formData.append('contactNumber', this.form.contactNumber);
    if (this.form.MoaFile) {
      formData.append('MoaFile', this.form.MoaFile);
      console.log(formData);
    }
    formData.append('startPartnership', this.form.startPartnership);
    formData.append('endPartnership', this.form.endPartnership);

    return this.backend.addPartner(formData, this.id).subscribe({
      next: (data) => {
        console.log(data);
        (this.form.name = ''),
          (this.form.address = ''),
          (this.form.contactPerson = ''),
          (this.form.contactNumber = ''),
          (this.form.MoaFile = null),
          (this.form.startPartnership = ''),
          (this.form.endPartnership = ''),
          this.swal.swalSucces('Partner Added Successfully');
          this.router.navigateByUrl(`program/${this.id}/add-participant`);
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
    this.router.navigateByUrl(`program/${this.id}/add-participant`);
  }
  goBack() {
    this.location.back();
  }
}
