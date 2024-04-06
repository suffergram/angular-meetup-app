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
import { SearchComponent } from '../search/search.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MeetupCardComponent,
    FormComponent,
    UserCardComponent,
    SearchComponent,
    SpinnerComponent,
    NgFor,
    NgIf,
  ],
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
  public FormTitle = FormTitle;

  public meetups = [] as Meetup[];
  public users = [] as User[];
  public meetup? = {} as Meetup;

  public isModalOpen: boolean = false;
  public modalTitle: string = '';

  private search: string = '';

  public isLoading: boolean = false;

  ngOnInit(): void {
    this.meetupService
      .loadMeetups()
      .pipe(takeUntil(this._destroyer))
      .subscribe((data: Object) => {
        this.isLoading = true;
        const meetups = data as Meetup[];
        this.meetupService.setMeetups(meetups);
        this.meetups = this.meetupService.getMeetups();
        this.isLoading = false;
      });

    if (this.authService.user.roles[0].name === UserRole.Admin) {
      this.userService
        .loadUsers()
        .pipe(takeUntil(this._destroyer))
        .subscribe((data: Object) => {
          this.isLoading = true;
          const users = data as User[];
          this.userService.setUsers(users);
          this.users = this.userService.getUsers();
          this.isLoading = false;
        });
    }

    this.router.events.subscribe(() => {
      this.isModalOpen = false;
    });
  }

  ngDoCheck(): void {
    if (this.search !== '' && this.router.url === '/') {
      this.meetups = this.meetupService.filterBySearch(
        this.search,
        this.meetupService.getMeetups()
      );
    } else {
      this.meetups = this.meetupService.getMeetups();
      this.search = '';
    }
  }

  ngOnDestroy(): void {
    this._destroyer.complete();
    this.isModalOpen = false;
    this.search = '';
  }

  handleOpenModal(title: string = '', meetup?: Meetup) {
    this.modalTitle = title;
    this.isModalOpen = true;
    this.meetup = meetup;
    this.scrollPage();
  }

  handleCloseModal() {
    this.isModalOpen = false;
    this.scrollPage();
  }

  scrollPage() {
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

  handleSearchMeetups(search: string) {
    this.search = search;
  }
}
