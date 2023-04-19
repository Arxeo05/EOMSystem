import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-edit-participant',
  templateUrl: './edit-participant.component.html',
  styleUrls: ['./edit-participant.component.css'],
})
export class EditParticipantComponent {
  public form = {
    name: '',
  };
  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  id = Number(this.route.snapshot.paramMap.get('id'));

  error: any = [];
  editParticipant() {
    const formData = new FormData();
    formData.append('name', this.form.name);

    return this.backend.editParticipant(formData, this.id).subscribe({
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
