import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InstructionComponent } from './components/instruction/instruction.component';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { homeGuard } from './guards/home.guard';
import { loginGuard } from './guards/login.guard';
import { usersGuard } from './guards/users.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Все митапы',
    component: HomeComponent,
    children: [
      {
        path: 'my',
        title: 'Мои митапы',
        canActivate: [homeGuard],
        component: HomeComponent,
      },
      {
        path: 'users',
        title: 'Пользователи',
        canActivate: [usersGuard],
        component: HomeComponent,
      },
    ],
    canActivate: [homeGuard],
  },
  {
    path: 'login',
    title: 'Вход в систему',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'registration',
    title: 'Регистрация',
    component: RegistrationComponent,
    canActivate: [loginGuard],
  },
  { path: 'instruction', title: 'Инструкция', component: InstructionComponent },
];
