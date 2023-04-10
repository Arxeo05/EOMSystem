import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private backend: BackendService) {}
  test: any;
  ngOnInit(): void {
    this.backend.me().subscribe({
      next: (data) => (this.test = data),
      error: (error) => console.log(error),
    });
  }
}
