import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Subscription } from 'rxjs';
import { SwalService } from 'src/app/services/swal.service';
@Component({
  selector: 'app-archived-users',
  templateUrl: './archived-users.component.html',
  styleUrls: ['./archived-users.component.css'],
})
export class ArchivedUsersComponent implements OnInit, OnDestroy {
  userValue: any;
  userChoices: any;
  users: any[] = [];
  constructor(
    private backend: BackendService,
    private swal: SwalService) {}
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
  ngOnInit(): void {
    this.allUsers();
  }
  private userSub: Subscription = new Subscription();
  private deleteSub: Subscription = new Subscription();
  private filterSub: Subscription = new Subscription();

  allUsers() {
    this.userSub = this.backend.archivedUsers().subscribe({
      next: (data) => (this.users = Object.values(data)),
    });
  }
  recoverUser(id: number) {
    this.deleteSub = this.backend.recoverUser(id).subscribe({
      next: (data) => {
        this.swal.swalSucces("User Recovered Successfully")
        console.log(data);
        location.reload();
      },
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
