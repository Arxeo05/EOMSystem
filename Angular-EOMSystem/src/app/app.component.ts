import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  title = 'Angular-EOMSystem';
  notification = '';
  loggedIn = false;
  loading = true;

  ngOnInit(): void {
    //subscribing to laravel notify function but it returns null value
    // this.backend.notify().subscribe({
    //   next: notification => {
    //     this.notification = notification;
    //     console.log(this.notification);
    //   }
    // })
    // Swal.fire('Hi','Hey There!', 'success');
    this.auth.authStatus.subscribe((value) => {
      this.loggedIn = value;
    });
    this.loading = false;
  }
}
