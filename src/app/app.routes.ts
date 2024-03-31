import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InstructionComponent } from './components/instruction/instruction.component';
import { HomeComponent } from './components/home/home.component';
import { homeGuard } from './guards/home.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [homeGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'instruction', component: InstructionComponent },
];
