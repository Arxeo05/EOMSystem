import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
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
