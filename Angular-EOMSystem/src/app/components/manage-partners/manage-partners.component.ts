import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-manage-partners',
  templateUrl: './manage-partners.component.html',
  styleUrls: ['./manage-partners.component.css'],
})
export class ManagePartnersComponent implements OnInit {
  partners: any;
  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.partnerById(id);
  }
  partnerById(id: number) {
    this.backend
      .partnerById(id)
      .pipe(take(1))
      .subscribe({
        next: (data) => (this.partners = data),
      });
  }
}
