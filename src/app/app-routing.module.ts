import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // A raiz do site abre o login
];