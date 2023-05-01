import { Component, OnDestroy } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnDestroy {
  userValue: any;
  userChoices: any;
  constructor(private backend: BackendService) {}
  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }
  users: any[] = [];

  ngOnInit(): void {
    this.allUsers();
  }

  private userSub: Subscription = new Subscription();
  private deleteSub: Subscription = new Subscription();
  private filterSub: Subscription = new Subscription();
  allUsers() {
    this.userSub = this.backend.allUsers().subscribe({
      next: (data) => (this.users = Object.values(data)),
    });
  }
  deleteUser(id: number) {
    this.deleteSub = this.backend.deleteUser(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
  }
  filterByUser() {
    this.filterSub = this.backend.userByStatus(this.userValue).subscribe({
      next: (data) => (this.users = Object.values(data)),
    });
  }
  clearFilter() {
    this.userValue = null;
    this.allUsers();
  }
}
