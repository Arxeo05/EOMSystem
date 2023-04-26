import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent {
  userValue: any;
  userChoices: any;
  constructor(private backend: BackendService) {}
  users: any[] = [];

  ngOnInit(): void {
    this.allUsers();
  }

  allUsers() {
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
  filterByUser() {
    this.backend.userByStatus(this.userValue).subscribe({
      next: (data) => (this.users = Object.values(data)),
    });
  }
  clearFilter() {
    this.userValue = null;
    this.allUsers();
  }
}
