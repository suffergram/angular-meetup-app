import { Component, DoCheck } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements DoCheck {
  constructor(private authService: AuthService, public router: Router) {}

  user: User | null = null;

  ngDoCheck(): void {
    this.user = this.authService.user;
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.router.navigate(['login']);
  }
}
