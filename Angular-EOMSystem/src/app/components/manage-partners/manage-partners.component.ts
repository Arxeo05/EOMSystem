import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-manage-partners',
  templateUrl: './manage-partners.component.html',
  styleUrls: ['./manage-partners.component.css'],
})
export class ManagePartnersComponent implements OnInit {
  formValues: any;
  public form = {
    name: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    MoaFile: null,
    startPartnership: '',
    endPartnership: '',
  };
  partners: any;
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
  id = Number(this.route.snapshot.paramMap.get('id'));
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.backend.partnerById(id).subscribe({
      next: (data) => {
        this.formValues = Object.values(data);
        this.form.name = this.formValues[0].name;
        this.form.address = this.formValues[0].address;
        this.form.contactPerson = this.formValues[0].contactPerson;
        this.form.contactNumber = this.formValues[0].contactNumber;
        this.form.MoaFile = this.formValues[0].MoaFile;
        this.form.startPartnership = this.formValues[0].startPartnership;
        this.form.endPartnership = this.formValues[0].endPartnership;
      },
    });
  }

  error: any = [];
  editPartner() {
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('address', this.form.address);
    formData.append('contactPerson', this.form.contactPerson);
    formData.append('contactNumber', this.form.contactNumber);
    formData.append('startPartnership', this.form.startPartnership);
    formData.append('endPartnership', this.form.endPartnership);
    if (this.form.MoaFile) {
      formData.append('MoaFile', this.form.MoaFile);
    }

    const startDate = new Date(this.form.startPartnership)
    const endDate = new Date(this.form.endPartnership)

    let timeDifference = endDate.getTime() - startDate.getTime();
    let daysBefore = timeDifference / (1000 * 3600 * 24);
    let roundedDays = Math.round(daysBefore);

    if(roundedDays < 365) {
      this.swal.swalError("Partnership Duration Must Be At Least A Year. Try Again?");
    }

    return this.backend.updatePartner(formData, this.id).subscribe({
      next: (data) => {
        this.swal.swalSucces('Edit Successful;');
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

  goBack(): void {
    this.location.back();
  }
}
