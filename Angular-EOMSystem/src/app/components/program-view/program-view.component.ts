import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.css'],
})
export class ProgramViewComponent implements AfterViewInit {
  programs: any;
  programLeader: any;
  programMembers: any;
  programPartners: any;
  programParticipants: any;
  programFlows: any;
  programFiles: any[] = [];
  isAdmin: boolean = false;

  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngAfterViewInit(): void {
    this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
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
}
