import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Meetup } from '../interfaces/meetup';
import { SubInfo } from '../interfaces/sub-info';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public meetups: Meetup[] = [];
  public userMeetups: boolean = false;

  baseUrl: string = `${environment.backendOrigin}/meetup`;

  fetchMeetups() {
    return this.http.get(this.baseUrl);
  }

  setMeetups(data: Meetup[]) {
    this.meetups = data;
  }

  getMeetups(): Meetup[] {
    if (this.userMeetups) return this.filterMeetups();
    return this.meetups;
  }

  filterMeetups(): Meetup[] {
    return this.meetups.filter(
      (meetup: Meetup) =>
        meetup.users.some((user) => user.id === this.authService.user.id) ||
        meetup.createdBy === this.authService.user.id
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
    this.meetups = [
      ...this.meetups,
      {
        ...data,
        createdBy: this.authService.user.id,
        users: [],
        owner: {
          ...this.authService.user,
        },
      },
    ];
  }

  deleteMeetup(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  removeMeetup(id: number) {
    this.meetups = this.meetups.filter((meetup) => meetup.id !== id);
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
