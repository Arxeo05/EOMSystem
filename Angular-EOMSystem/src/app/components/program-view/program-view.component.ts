import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.css'],
})
export class ProgramViewComponent implements AfterViewInit, OnDestroy {
  programs: any;
  programLeader: any;
  programMembers: any;
  programPartners: any;
  programParticipants: any;
  programFlows: any;
  programFiles: any[] = [];
  isAdmin: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private backend: BackendService, private route: ActivatedRoute) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  ngAfterViewInit(): void {
    const sub1 = this.backend.userRole().subscribe((data: { role: number }) => {
      if (data.role === 1) {
        this.isAdmin = true;
      }
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.programsById(id);

    const sub2 = this.backend.programLeader(id).subscribe({
      next: (data) => (this.programLeader = data),
    });

    this.programMember(id);
    this.programPartner(id);
    this.programParticipant(id);
    this.programFile(id);
    this.programFlow(id);

    this.subscriptions.push(sub1);
    this.subscriptions.push(sub2);
  }
  programsById(id: number): void {
    const sub3 = this.backend.programsById(id).subscribe({
      next: (data) => (this.programs = Object.values(data)),
    });
    this.subscriptions.push(sub3);
  }
  programMember(pid: number) {
    const sub4 = this.backend.programMember(pid).subscribe({
      next: (data) => (this.programMembers = data),
    });
    this.subscriptions.push(sub4);
  }

  programFlow(pid: number) {
    const sub5 = this.backend.programFlow(pid).subscribe({
      next: (data) => (this.programFlows = Object.values(data)),
    });
    this.subscriptions.push(sub5);
  }

  programPartner(pid: number) {
    const sub6 = this.backend.programPartners(pid).subscribe({
      next: (data) => {
        this.programPartners = Object.values(data);
      },
    });
    this.subscriptions.push(sub6);
  }

  moaFile: string = '';
  partnerMoa(event: MouseEvent, index: number) {
    event.preventDefault();
    const sub7 = this.backend
      .getMoa(this.programPartners[index].MoaFile)
      .subscribe({
        next: (data) => {
          this.moaFile = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = this.moaFile;
          link.target = '_blank';
          link.click();
        },
      });
    this.subscriptions.push(sub7);
  }

  programParticipant(pid: number) {
    const sub8 = this.backend.programParticipants(pid).subscribe({
      next: (data) => (this.programParticipants = Object.values(data)),
    });
    this.subscriptions.push(sub8);
  }

  programFile(pid: number) {
    const sub9 = this.backend.programFiles(pid).subscribe({
      next: (data) => {
        this.programFiles = Object.values(data);
      },
    });
    this.subscriptions.push(sub9);
  }
  fileUrl: string = '';
  programFilelink(event: MouseEvent, index: number) {
    event.preventDefault();
    const sub10 = this.backend
      .getFile(this.programFiles[index].file)
      .subscribe({
        next: (data) => {
          this.fileUrl = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = this.fileUrl;
          link.target = '_blank';
          link.click();
        },
      });
    this.subscriptions.push(sub10);
  }

  deleteMember(pid: number, uid: number) {
    const sub11 = this.backend.deleteMember(pid, uid).subscribe({
      next: (data) => console.log(data),
    });
    this.subscriptions.push(sub11);
  }
  deletePartner(id: number) {
    const sub12 = this.backend.deletePartner(id).subscribe({
      next: (data) => console.log(data),
    });
    this.subscriptions.push(sub12);
  }
  deleteParticipant(id: number) {
    const sub13 = this.backend.deleteParticipant(id).subscribe({
      next: (data) => console.log(data),
    });
    this.subscriptions.push(sub13);
  }
  deleteFlow(id: number) {
    const sub14 = this.backend.deleteFlow(id).subscribe({
      next: (data) => console.log(data),
    });
    this.subscriptions.push(sub14);
  }
  deleteFile(id: number) {
    const sub15 = this.backend.deleteFile(id).subscribe({
      next: (data) => console.log(data),
    });
    this.subscriptions.push(sub15);
  }
}
