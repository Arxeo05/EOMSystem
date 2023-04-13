import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private backend: BackendService) {}
  infos: any;
  ngOnInit(): void {
    this.backend.me().subscribe({
      next: (data) => (this.infos = data),
      error: (error) => console.log(error),
    });
  }
}
