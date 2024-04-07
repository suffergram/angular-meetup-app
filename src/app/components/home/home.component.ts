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
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MeetupCardComponent,
    FormComponent,
    UserCardComponent,
    SearchComponent,
    SpinnerComponent,
    ModalComponent,
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

  public isLoading: boolean = false;
  public isFormOpen: boolean = false;

  public formTitle: string = '';
  private search: string = '';

  ngOnInit(): void {
    this.isLoading = true;
    this.meetupService
      .loadMeetups()
      .pipe(takeUntil(this._destroyer))
      .subscribe((data: Object) => {
        const meetups = data as Meetup[];
        this.meetupService.setMeetups(meetups);
        this.meetups = this.meetupService.getMeetups();
        this.isLoading = false;
      });

    this.isLoading = true;
    if (this.authService.user.roles[0].name === UserRole.Admin) {
      this.userService
        .loadUsers()
        .pipe(takeUntil(this._destroyer))
        .subscribe((data: Object) => {
          const users = data as User[];
          this.userService.setUsers(users);
          this.users = this.userService.getUsers();
          this.isLoading = false;
        });
    }

    this.router.events.subscribe(() => {
      this.isFormOpen = false;
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
    this.isFormOpen = false;
    this.search = '';
  }

  handleFormOpen(title: string = '', meetup?: Meetup) {
    this.formTitle = title;
    this.isFormOpen = true;
    this.meetup = meetup;
    this.scrollPage();
  }

  handleFormClose() {
    this.isFormOpen = false;
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
    this.handleFormOpen(FormTitle.Edit, meetup);
  }

  handleSearchMeetups(search: string) {
    this.search = search;
  }
}
