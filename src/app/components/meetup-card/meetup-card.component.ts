import { Component, Input, OnInit } from '@angular/core';
import { Meetup } from '../../interfaces/meetup';
import { MeetupService } from '../../services/meetup.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubInfo } from '../../interfaces/sub-info';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-meetup-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './meetup-card.component.html',
  styleUrl: './meetup-card.component.scss',
})
export class MeetupCardComponent implements OnInit {
  constructor(
    private meetupService: MeetupService,
    private authService: AuthService
  ) {}

  @Input()
  meetup!: Meetup;

  subs: string = '';
  date: string = '';

  currentUser: User | null = null;

  meetupUsers: Array<number> = [];

  public opened: boolean = false;

  ngOnInit(): void {
    this.subs = this.meetupService.plural(this.meetup.users.length, {
      one: 'подписчик',
      few: 'подписчика',
      many: 'подписчиков',
    });
    this.date = this.meetupService.dateFormat(this.meetup?.time);
    this.currentUser = this.authService.user;
    this.meetupUsers = this.meetup.users.map((user) => user.id);
  }

  onToggle() {
    this.opened = !this.opened;
  }

  onSubscribe() {
    if (this.currentUser) {
      const data: SubInfo = {
        idMeetup: this.meetup.id,
        idUser: this.currentUser.id,
      };
      this.meetupService.subscribeUser(data).subscribe((data: Object) => {
        this.meetupService.updateMeetup(data as Meetup);
      });
    }
  }

  onUnsubscribe() {
    if (this.currentUser) {
      const data: SubInfo = {
        idMeetup: this.meetup.id,
        idUser: this.currentUser.id,
      };
      this.meetupService.unsubscribeUser(data).subscribe((data: Object) => {
        this.meetupService.updateMeetup(data as Meetup);
      });
    }
  }
}
