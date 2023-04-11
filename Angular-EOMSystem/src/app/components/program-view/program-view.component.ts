import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.css'],
})
export class ProgramViewComponent implements OnInit {
  programs: any;
  programLeader: any;
  programMembers: any;
  programPartners: any;
  programParticipants: any;

  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
    });

    this.programMember(id);
    this.programPartner(id);
    this.programParticipant(id);
  }
  programsById(id: number): void {
    this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = data),
    });
  }
  programMember(pid: number) {
    this.backend.programMember(pid).subscribe({
      next: (data) => (this.programMembers = data),
    });
  }
  programPartner(pid: number) {
    this.backend.programPartners(pid).subscribe({
      next: (data) => (this.programPartners = data),
    });
  }

  programParticipant(pid: number) {
    this.backend.programParticipants(pid).subscribe({
      next: (data) => (this.programParticipants = data),
    });
  }
}
