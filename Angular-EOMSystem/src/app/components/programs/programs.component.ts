import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css'],
})
export class ProgramsComponent implements AfterViewInit {
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

  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngAfterViewInit(): void {
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
      this.loading = false;
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
    });
    this.backend.allUsers().subscribe({
      next: (data: any) => (this.leaderChoices = data),
    });

    this.programMember(id);
    this.programPartner(id);
    this.programParticipant(id);
    this.programFile(id);
    this.programFlow(id);
  }
  programsById(id: number): void {
    this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }
  programMember(pid: number) {
    this.backend.programMember(pid).subscribe({
      next: (data) => (this.programMembers = data),
    });
  }
  search() {
    this.backend.searchProgram(this.searchValue).subscribe({
      next: (data) => (this.searchedPrograms = Object.values(data)),
    });
  }
  filterByLeader() {
    this.backend.filterByLeader(this.leaderValue).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  programFlow(pid: number) {
    this.backend.programFlow(pid).subscribe({
      next: (data) => (this.programFlows = Object.values(data)),
    });
  }

  programPartner(pid: number) {
    this.backend.programPartners(pid).subscribe({
      next: (data) => {
        this.programPartners = Object.values(data);
      },
    });
    this.backend.programs().subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
  }

  moaFile: string = '';
  partnerMoa(event: MouseEvent, index: number) {
    event.preventDefault();
    this.backend.getMoa(this.programPartners[index].MoaFile).subscribe({
      next: (data) => {
        this.moaFile = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = this.moaFile;
        link.target = '_blank';
        link.click();
      },
    });
  }

  programParticipant(pid: number) {
    this.backend.programParticipants(pid).subscribe({
      next: (data) => (this.programParticipants = Object.values(data)),
    });
  }

  programFile(pid: number) {
    this.backend.programFiles(pid).subscribe({
      next: (data) => {
        this.programFiles = Object.values(data);
      },
    });
  }
  fileUrl: string = '';
  programFilelink(event: MouseEvent, index: number) {
    event.preventDefault();
    this.backend.getFile(this.programFiles[index].file).subscribe({
      next: (data) => {
        this.fileUrl = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = this.fileUrl;
        link.target = '_blank';
        link.click();
      },
    });
  }

  deleteMember(pid: number, uid: number) {
    this.backend.deleteMember(pid, uid).subscribe({
      next: (data) => console.log(data),
    });
  }
  deletePartner(id: number) {
    this.backend.deletePartner(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteParticipant(id: number) {
    this.backend.deleteParticipant(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteFlow(id: number) {
    this.backend.deleteFlow(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteFile(id: number) {
    this.backend.deleteFile(id).subscribe({
      next: (data) => console.log(data),
    });
  }
  deleteProgram(id: number) {
    this.backend.deleteProgram(id).subscribe({
      next: (data) => console.log(data),
      error: (error) => console.log(error),
    });
  }

  onSearchInputChange() {
    if (this.searchValue === '') {
      this.backend.programs().subscribe({
        next: (data) => (this.programs = Object.values(data)),
      });
    } else {
      this.search();
    }
  }
}
