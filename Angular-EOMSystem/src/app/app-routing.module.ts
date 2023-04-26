import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TokenService } from './services/token.service';
import { ProgramViewComponent } from './components/program-view/program-view.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateProgramComponent } from './components/create-program/create-program.component';
import { ManagePartnersComponent } from './components/manage-partners/manage-partners.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { EditProgramComponent } from './components/edit-program/edit-program.component';
import { AddPartnerComponent } from './components/add-partner/add-partner.component';
import { AddParticipantComponent } from './components/add-participant/add-participant.component';
import { EditParticipantComponent } from './components/edit-participant/edit-participant.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { EditFileComponent } from './components/edit-file/edit-file.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { MoaRenewComponent } from './components/moa-renew/moa-renew.component';
import { UpdateUserPasswordComponent } from './components/update-user-password/update-user-password.component';
import { RoleGuardGuard } from './role-guard.guard';
import { AddFlowComponent } from './components/add-flow/add-flow.component';
import { TerminalReportComponent } from './components/terminal-report/terminal-report.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { EditUserPhotoComponent } from './components/edit-user-photo/edit-user-photo.component';

function logGuard() {
  const token = inject(TokenService);
  return !token.loggedIn();
}

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [logGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [logGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => inject(TokenService).loggedIn()],
  },
  {
    path: 'profile/edit-profile',
    component: EditUserProfileComponent,
    canActivate: [() => inject(TokenService).loggedIn()],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => inject(TokenService).loggedIn()],
  },
  {
    path: 'create-program',
    component: CreateProgramComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id',
    component: ProgramViewComponent,
    canActivate: [() => inject(TokenService).loggedIn()],
  },
  {
    path: 'dashboard/program/edit/:id',
    component: EditProgramComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/manage-partners',
    component: ManagePartnersComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'partner/renew/:id',
    component: MoaRenewComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/terminal-report',
    component: TerminalReportComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'program/:id/add-member',
    component: AddMemberComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/add-member',
    component: AddMemberComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'program/:id/add-partner',
    component: AddPartnerComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/add-partner',
    component: AddPartnerComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'program/:id/add-participant',
    component: AddParticipantComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/add-participant',
    component: AddParticipantComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/edit-participant',
    component: EditParticipantComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'program/:id/add-flow',
    component: AddFlowComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/add-flow',
    component: AddFlowComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'program/:id/add-file',
    component: AddFileComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/add-file',
    component: AddFileComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'dashboard/program/:id/edit-file',
    component: EditFileComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'user/all-users',
    component: AllUsersComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'user/all-users/edit-user/:id',
    component: EditUserComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'user/all-users/edit-user/:id/user-photo',
    component: EditUserPhotoComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'user/all-users/update-password/:id',
    component: UpdateUserPasswordComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [() => inject(TokenService).loggedIn(), RoleGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
