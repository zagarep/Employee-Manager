import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Employees } from './pages/employees/employees';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'employees', component: Employees },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
