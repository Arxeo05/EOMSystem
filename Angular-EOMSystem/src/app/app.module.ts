import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProgramViewComponent } from './components/program-view/program-view.component';
import { CreateProgramComponent } from './components/create-program/create-program.component';
import { ManagePartnersComponent } from './components/manage-partners/manage-partners.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { EditProgramComponent } from './components/edit-program/edit-program.component';
import { AddPartnerComponent } from './components/add-partner/add-partner.component';
import { AddParticipantComponent } from './components/add-participant/add-participant.component';
import { EditParticipantComponent } from './components/edit-participant/edit-participant.component';
import { AddFileComponent } from './components/add-file/add-file.component';
import { EditFileComponent } from './components/edit-file/edit-file.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { MoaRenewComponent } from './components/moa-renew/moa-renew.component';
import { UpdateUserPasswordComponent } from './components/update-user-password/update-user-password.component';
import { AddFlowComponent } from './components/add-flow/add-flow.component';
import { TerminalReportComponent } from './components/terminal-report/terminal-report.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { EditUserPhotoComponent } from './components/edit-user-photo/edit-user-photo.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    SideNavComponent,
    DashboardComponent,
    ProgramViewComponent,
    CreateProgramComponent,
    ManagePartnersComponent,
    AddMemberComponent,
    EditProgramComponent,
    AddPartnerComponent,
    AddParticipantComponent,
    EditParticipantComponent,
    AddFileComponent,
    EditFileComponent,
    EditUserComponent,
    AllUsersComponent,
    AnnouncementsComponent,
    MoaRenewComponent,
    UpdateUserPasswordComponent,
    AddFlowComponent,
    TerminalReportComponent,
    EditUserProfileComponent,
    EditUserPhotoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ChartModule,
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] }],
  bootstrap: [AppComponent],
})
export class AppModule {}
