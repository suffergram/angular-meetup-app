import { Component } from '@angular/core';
import { MeetupService } from '../../services/meetup.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enums/user-role';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgIf],
  providers: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(
    public meetupService: MeetupService,
    public authService: AuthService,
    public router: Router
  ) {}

  public UserRole = UserRole;

  handleAllMeetups() {
    this.router.navigate(['']);
  }

  handleUserMeetups() {
    this.router.navigate(['my']);
  }

  handleUsers() {
    this.router.navigate(['users']);
  }
}
