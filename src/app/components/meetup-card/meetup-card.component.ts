import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meetup } from '../../interfaces/meetup';
import { MeetupService } from '../../services/meetup.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SubInfo } from '../../interfaces/sub-info';
import { User } from '../../interfaces/user';
import { UserRole } from '../../enums/user-role';

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

  @Output()
  public editMeetup = new EventEmitter();

  @Input()
  public meetup!: Meetup;

  public subs: string = '';
  public date: string = '';
  public minutes: string = '';
  public currentUser: User | null = null;
  public meetupUsers: Array<number> = [];
  public UserRole = UserRole;

  public opened: boolean = false;
  public isActual: boolean = false;

  ngOnInit(): void {
    this.subs = this.meetupService.plural(this.meetup.users.length, {
      one: 'подписчик',
      few: 'подписчика',
      many: 'подписчиков',
    });
    this.minutes = this.meetupService.plural(this.meetup.duration, {
      one: 'минута',
      few: 'минуты',
      many: 'минут',
    });
    this.date = this.meetupService.dateFormat(this.meetup?.time);
    this.currentUser = this.authService.user;
    this.meetupUsers = this.meetup.users.map((user) => user.id);

    this.isActual =
      this.meetup && Date.now() <= new Date(this.meetup.time).valueOf();
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

  onEditMeetup() {
    this.editMeetup.emit();
  }

  onDeleteMeetup() {
    this.meetupService.deleteMeetup(this.meetup.id).subscribe(() => {
      this.meetupService.removeMeetup(this.meetup.id);
    });
  }
}
