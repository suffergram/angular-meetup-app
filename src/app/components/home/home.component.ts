import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MeetupService } from '../../services/meetup.service';
import { Subject, takeUntil } from 'rxjs';
import { Meetup } from '../../interfaces/meetup';
import { MeetupCardComponent } from '../meetup-card/meetup-card.component';
import { NgFor, NgIf } from '@angular/common';
import { FormComponent } from '../form/form.component';
import { FormTitle } from '../../enums/form-title';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enums/user-role';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MeetupCardComponent, FormComponent, UserCardComponent, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, DoCheck {
  constructor(
    public meetupService: MeetupService,
    public router: Router,
    public authService: AuthService,
    public userService: UserService
  ) {}

  private _destroyer = new Subject();
  public meetups = [] as Meetup[];
  public FormTitle = FormTitle;

  public isModalOpen: boolean = false;
  public modalTitle: string = '';

  public users = [] as User[];

  public meetup? = {} as Meetup;

  ngOnInit(): void {
    this.meetupService
      .fetchMeetups()
      .pipe(takeUntil(this._destroyer))
      .subscribe((data: Object) => {
        this.meetupService.setMeetups(data as Meetup[]);
        this.meetups = this.meetupService.getMeetups();
      });

    if (this.authService.user.roles[0].name === UserRole.Admin) {
      this.userService
        .fetchUsers()
        .pipe(takeUntil(this._destroyer))
        .subscribe((data: Object) => {
          this.userService.setUsers(data as User[]);
          this.users = this.userService.getUsers();
        });
    }

    this.router.events.subscribe(() => {
      this.isModalOpen = false;
    });
  }

  ngDoCheck(): void {
    this.meetups = this.meetupService.getMeetups();
  }

  ngOnDestroy(): void {
    this._destroyer.complete();
    this.isModalOpen = false;
  }

  handleOpenModal(title: string = '', meetup?: Meetup) {
    this.modalTitle = title;
    this.isModalOpen = true;
    this.meetup = meetup;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  handleCloseModal() {
    this.isModalOpen = false;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== id);
    });
  }

  handleEditMeetup(meetup: Meetup) {
    this.handleOpenModal(FormTitle.Edit, meetup);
  }
}
