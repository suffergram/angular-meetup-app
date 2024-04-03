import { Component } from '@angular/core';
import { MeetupService } from '../../services/meetup.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(public meetupService: MeetupService) {}

  handleAllMeetups() {
    this.meetupService.userMeetups = false;
  }

  handleUserMeetups() {
    this.meetupService.userMeetups = true;
  }
}
