import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TokenService } from './services/token.service';
import { ProgramViewComponent } from './components/program-view/program-view.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

function logGuard() {
  const token = inject(TokenService);
  return !token.loggedIn();
}
const routes: Routes = [
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
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'dashboard/program/:id',
    component: ProgramViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
