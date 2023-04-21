import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-manage-partners',
  templateUrl: './manage-partners.component.html',
  styleUrls: ['./manage-partners.component.css'],
})
export class ManagePartnersComponent implements OnInit {
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
    private location: Location
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
    this.partnerById(this.id);
  }
  partnerById(id: number) {
    this.backend
      .partnerById(id)
      .pipe(take(1))
      .subscribe({
        next: (data) => (this.partners = data),
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

    return this.backend.updatePartner(formData, this.id).subscribe({
      next: (data) => console.log(data),
      error: (error) => {
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
