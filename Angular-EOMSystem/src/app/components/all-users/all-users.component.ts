import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent {
  constructor(private backend: BackendService) {}
  users: any[] = [];

  ngOnInit(): void {
    this.backend.allUsers().subscribe({
      next: (data) => (this.users = Object.values(data)),
    });
  }

  deleteUser(id: number) {
    this.backend.deleteUser(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
  }
}
