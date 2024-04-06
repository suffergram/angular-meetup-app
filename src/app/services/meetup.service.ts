import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Meetup } from '../interfaces/meetup';
import { SubInfo } from '../interfaces/sub-info';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { REQUEST_INTERVAL } from '../constants/request-interval';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private meetupsInterval: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.loggedInToken().subscribe((token) => {
      if (token) {
        this.fetchMeetups();
        this.meetupsInterval = setInterval(() => {
          this.fetchMeetups();
        }, REQUEST_INTERVAL);
      } else {
        clearInterval(this.meetupsInterval);
      }
    });
  }

  public meetups: Meetup[] = [];

  private meetupsSubject = new BehaviorSubject<Meetup[]>([]);

  baseUrl: string = `${environment.backendOrigin}/meetup`;

  fetchMeetups() {
    this.http
      .get<Meetup[]>(this.baseUrl)
      .subscribe(
        (meetups) =>
          meetups.length !== this.meetups.length &&
          this.meetupsSubject.next(meetups)
      );
  }

  loadMeetups() {
    return this.meetupsSubject.asObservable();
  }

  setMeetups(data: Meetup[]) {
    this.meetups = this.sortMeetups(data);
  }

  sortMeetups(data: Meetup[]) {
    return data.sort((a: Meetup, b: Meetup) => {
      const aDate = new Date(a.time).valueOf();
      const bDate = new Date(b.time).valueOf();
      return aDate - bDate;
    });
  }

  getMeetups(): Meetup[] {
    switch (this.router.url) {
      case '/my':
        return this.filterByUser();
      default:
        return this.meetups;
    }
  }

  filterByUser(): Meetup[] {
    return this.meetups.filter(
      (meetup: Meetup) =>
        meetup.users.some((user) => user.id === this.authService.user.id) ||
        meetup.createdBy === this.authService.user.id
    );
  }

  filterBySearch(search: string, meetups: Meetup[]) {
    return meetups.filter(
      (meetup: Meetup) =>
        meetup.description.toLowerCase().includes(search.toLowerCase()) ||
        meetup.time.toLowerCase().includes(search.toLowerCase()) ||
        meetup.owner.fio.toLowerCase().includes(search.toLowerCase()) ||
        meetup.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  updateMeetup(newData: Meetup) {
    this.meetups = this.meetups.map((meetup) => {
      if (meetup.id === newData.id)
        return {
          ...meetup,
          users: newData.users,
        };
      else return meetup;
    });
  }

  subscribeUser(data: SubInfo) {
    return this.http.put(this.baseUrl, data);
  }

  unsubscribeUser(data: SubInfo) {
    return this.http.delete(this.baseUrl, { body: data });
  }

  postMeetup(data: Partial<Meetup>) {
    return this.http.post(this.baseUrl, data);
  }

  addMeetup(data: Meetup) {
    this.meetups = this.sortMeetups([
      ...this.meetups,
      {
        ...data,
        createdBy: this.authService.user.id,
        users: [],
        owner: {
          ...this.authService.user,
        },
      },
    ]);
  }

  deleteMeetup(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  removeMeetup(id: number) {
    this.meetups = this.meetups.filter((meetup) => meetup.id !== id);
  }

  editMeetup(id: number, data: Partial<Meetup>) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  changeMeetup(data: Partial<Meetup>) {
    this.meetups = this.sortMeetups(
      this.meetups.map((meetup) => {
        if (meetup.id === data.id)
          return {
            ...meetup,
            ...data,
          };
        return meetup;
      })
    );
  }

  plural(
    value: number,
    variants: { [index: string]: string } = {},
    locale = 'ru-RU'
  ) {
    const key = new Intl.PluralRules(locale).select(value);
    return variants[key] || '';
  }

  dateFormat(value: string, locale = 'ru-RU') {
    const date = new Date(value);
    const result = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return result;
  }
}
