import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css'],
})
export class AddParticipantComponent {
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  id = Number(this.route.snapshot.paramMap.get('id'));
  error: any = [];
  public form = {
    name: '',
  };

  addParticipant() {
    const formData = new FormData();
    formData.append('name', this.form.name);

    return this.backend.addParticipant(formData, this.id).subscribe({
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
