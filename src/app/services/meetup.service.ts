import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Meetup } from '../interfaces/meetup';
import { SubInfo } from '../interfaces/sub-info';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  constructor(private http: HttpClient) {}

  public meetups: Meetup[] = [];

  baseUrl: string = `${environment.backendOrigin}/meetup`;

  fetchMeetups() {
    return this.http.get(this.baseUrl);
  }

  setMeetups(data: Meetup[]) {
    this.meetups = data;
  }

  getMeetups(): Meetup[] {
    return this.meetups;
  }

  updateMeetup(newData: Meetup) {
    this.meetups = this.getMeetups().map((meetup) => {
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
