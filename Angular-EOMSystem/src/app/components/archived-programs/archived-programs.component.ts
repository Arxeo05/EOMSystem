import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-archived-programs',
  templateUrl: './archived-programs.component.html',
  styleUrls: ['./archived-programs.component.css'],
})
export class ArchivedProgramsComponent implements AfterViewInit {
  programs: any[] = [];
  programLeader: any;
  programMembers: any;
  programPartners: any;
  programParticipants: any;
  programFlows: any;
  programFiles: any[] = [];
  isAdmin = false;
  loading: boolean = true;
  searchValue: any;
  searchedPrograms: any[] = [];
  leaderValue: any;
  leaderChoices: any;
  leadPrograms: any[] = [];
  memberPrograms: any[] = [];

  constructor(
    private backend: BackendService,
    private route: ActivatedRoute,
    private swal: SwalService) {}
  ngAfterViewInit(): void {
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
      this.loading = false;
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
    });
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });
    this.backend.archivedPrograms().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  search() {
    this.backend.searchArchiveProgram(this.searchValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  filterByLeader() {
    this.backend.filterArchiveProgramByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  recoverProgram(id: number) {
    this.backend.recoverProgram(id).subscribe({
      next: (data) => {
        console.log(data);
        this.swal.swalSucces("Program Successfully Recovered")
        location.reload();
      },
    });
  }

  onSearchInputChange() {
    if (this.searchValue === '') {
      this.backend.archivedPrograms().subscribe({
        next: (data) => (this.programs = Object.values(data)),
      });
    } else {
      this.search();
    }
  }
}
