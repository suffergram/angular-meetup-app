import { Component, DoCheck, OnDestroy, OnInit, inject } from '@angular/core';
import { MeetupService } from '../../services/meetup.service';
import { Subject, takeUntil } from 'rxjs';
import { Meetup } from '../../interfaces/meetup';
import { MeetupCardComponent } from '../meetup-card/meetup-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MeetupCardComponent, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, DoCheck {
  private meetupService = inject(MeetupService);
  private _destroyer = new Subject();
  public meetups = [] as Meetup[];

  ngOnInit(): void {
    this.meetupService
      .fetchMeetups()
      .pipe(takeUntil(this._destroyer))
      .subscribe((data: Object) => {
        this.meetupService.setMeetups(data as Meetup[]);
        this.meetups = this.meetupService.getMeetups();
      });
  }

  ngDoCheck(): void {
    this.meetups = this.meetupService.getMeetups();
  }

  ngOnDestroy(): void {
    this._destroyer.complete();
  }
}
