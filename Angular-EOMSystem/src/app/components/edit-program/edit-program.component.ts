import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.css'],
})
export class EditProgramComponent implements OnInit {
  public form = {
    title: null,
    startDate: null,
    endDate: null,
    place: null,
    leaderId: null,
    flow: null,
    additionalDetail: null,
  };
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
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
