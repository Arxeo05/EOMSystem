import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css'],
})
export class EditProgramComponent implements OnInit {
  formValues: any;
  public form = {
    title: null,
    startDate: null,
    endDate: null,
    place: null,
    leaderId: null,
    additionalDetail: null,
  };
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.backend.programsById(id).subscribe({
      next: (data) => {
        this.formValues = Object.values(data);
        this.form.title = this.formValues[0].title;
        this.form.startDate = this.formValues[0].startDate;
        this.form.endDate = this.formValues[0].endDate;
        this.form.place = this.formValues[0].place;
        this.form.leaderId = this.formValues[0].leaderId;
        this.form.additionalDetail = this.formValues[0].additionalDetail;
      },
    });
  }
  leaderChoices: any;
  id = Number(this.route.snapshot.paramMap.get('id'));
  editProgram() {
    console.log(this.form);
    this.backend.editProgram(this.form, this.id).subscribe({
      next: (data) => console.log(data),
      error: (error) => this.handleError(error),
    });
  }
  handleError(error: any) {}
}
