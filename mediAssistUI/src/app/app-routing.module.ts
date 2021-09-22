import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RemedyComponent } from './components/remedy/remedy.component';
import { SearchComponent } from './components/search/search.component';
import { AuthGuard } from './guards/auth-guard.guard';

const routes: Routes = [
  { path: '', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'remedy', component: RemedyComponent, canActivate: [AuthGuard] },
  {
    path: 'remedy/:remedyId',
    component: RemedyComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '*', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
