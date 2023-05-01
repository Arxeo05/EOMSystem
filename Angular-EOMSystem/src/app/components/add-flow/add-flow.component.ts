import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-add-flow',
  templateUrl: './add-flow.component.html',
  styleUrls: ['./add-flow.component.css'],
})
export class AddFlowComponent implements OnDestroy {
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private swal: SwalService
  ) {}
  ngOnDestroy(): void {
    if (this.addFlowSub) {
      this.addFlowSub.unsubscribe();
    }
  }
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  flows: any[] = [{ event: '', remarks: '', time: '' }];

  addUser() {
    this.flows.push({ event: '', remarks: '', time: '' });
  }

  removeUser(index: number) {
    this.flows.splice(index, 1);
  }

  private addFlowSub: Subscription = new Subscription();
  onSubmit() {
    const data = {
      flows: this.flows,
    };

    this.addFlowSub = this.backend.addFlow(data, this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.flows = [{ event: '', remarks: '', time: '' }];
        this.swal.swalSucces('Flow Added Successfully');
        this.router.navigateByUrl(`program/${this.id}/add-file`);
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
    this.router.navigateByUrl(`program/${this.id}/add-file`);
  }
  goBack() {
    this.location.back();
  }
  home() {
    this.router.navigateByUrl(`dashboard/program/${this.id}`);
  }
}
