import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements OnInit {
  public form = {
    userId: null,
  };
  memberChoices: any;
  id: number = 0;
  constructor(private route: ActivatedRoute, private backend: BackendService) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id = id;
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.memberChoices = data),
    });
  }

  addMember() {
    this.backend.addMember(this.id, this.form).subscribe({
      next: (data) => console.log(data),
      error: (error) => this.handleError(error),
    });
  }
  handleError(error: any) {}
}
