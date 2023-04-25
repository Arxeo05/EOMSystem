import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  infos: any[] = [];
  photoUrl: string = '';

  constructor(private backend: BackendService) {}
  ngOnInit(): void {
    this.backend.me().subscribe({
      next: (data) => {
        this.infos = Object.values(data);
        this.backend.userPhoto(data[0].photo).subscribe({
          next: (data) => {
            const reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
              this.photoUrl = reader.result as string;
            };
          },
        });
      },
      error: (error) => console.log(error),
    });
  }
}
