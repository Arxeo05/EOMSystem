import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-add-flow',
  templateUrl: './add-flow.component.html',
  styleUrls: ['./add-flow.component.css'],
})
export class AddFlowComponent {
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  flows: any[] = [{ event: '', remarks: '', time: '' }];

  addUser() {
    this.flows.push({ event: '', remarks: '', time: '' });
  }

  removeUser(index: number) {
    this.flows.splice(index, 1);
  }

  onSubmit() {
    const data = {
      flows: this.flows,
    };

    return this.backend.addFlow(data, this.id).subscribe({
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
