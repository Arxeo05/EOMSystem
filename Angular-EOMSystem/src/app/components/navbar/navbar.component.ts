import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  loading = true;
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
      this.loading = false;
    });
  }
  logout(event: MouseEvent) {
    event.preventDefault();
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('login');
  }
}
