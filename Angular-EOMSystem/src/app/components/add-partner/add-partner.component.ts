import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.css'],
})
export class AddPartnerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('partnerForm') myForm!: NgForm;

  canLeave = false;
  submit = false;
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
  ngAfterViewInit(): void {
    if (this.myForm) {
      this.myForm.valueChanges!.subscribe(() => {
        this.canLeave = this.myForm.dirty!;
      });
    }
  }
  ngOnDestroy(): void {
    if (this.partnerSub) {
      this.partnerSub.unsubscribe();
    }
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.form.MoaFile = event.target.files[0];
    } else {
      this.form.MoaFile = null;
    }
  }
  private partnerSub: Subscription = new Subscription();
  addPartner() {
    this.submit = true;
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

    const startDate = new Date(this.form.startPartnership);
    const endDate = new Date(this.form.endPartnership);

    let timeDifference = endDate.getTime() - startDate.getTime();
    let daysBefore = timeDifference / (1000 * 3600 * 24);
    let roundedDays = Math.round(daysBefore);

    if (roundedDays < 365) {
      this.swal.swalWarning(
        'Partnership Duration Must Be At Least A Year. Try Again?'
      );
    } else {
      this.partnerSub = this.backend.addPartner(formData, this.id).subscribe({
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
  home() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
  canleaveGuard() {
    if (this.canLeave && !this.submit) {
      return Swal.fire({
        title: 'Are you sure you want to leave?',
        text: 'You have unsaved changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        return result.isConfirmed;
      });
    }
    return true;
  }
}
