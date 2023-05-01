import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/services/swal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css'],
})
export class AddParticipantComponent implements OnDestroy {
  @ViewChild('myForm', { static: false }) myForm!: NgForm;
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private swal: SwalService
  ) {}
  ngOnDestroy(): void {
    if (this.partSub) {
      this.partSub.unsubscribe();
    }
  }
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  participants: any[] = [{ name: '' }];

  private partSub: Subscription = new Subscription();
  addParticipant() {
    const data = {
      participants: this.participants,
    };

    this.partSub = this.backend.addParticipant(data, this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.participants = [{ name: '' }];
        this.swal.swalSucces('Participant Added Successfully');
        this.router.navigateByUrl(`program/${this.id}/add-flow`);
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
    this.router.navigateByUrl(`program/${this.id}/add-flow`);
  }
  goBack() {
    this.location.back();
  }
  home() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
  addUser() {
    this.participants.push({ memberId: '' });
  }

  removeUser(index: number) {
    this.participants.splice(index, 1);
  }
}
