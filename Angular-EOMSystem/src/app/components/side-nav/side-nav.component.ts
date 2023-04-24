import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { BackendService } from '../../services/backend.service';
import {
  faBook,
  faCoffee,
  faDashboard,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  faDashboard = faDashboard;
  faBook = faBook;
  public loggedIn: boolean = false;
  public isAdmin: boolean = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private token: TokenService,
    private backend: BackendService
  ) {}

  ngOnInit() {
    this.auth.authStatus.subscribe((value) => {
      this.loggedIn = value;
    });
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
  }
}
