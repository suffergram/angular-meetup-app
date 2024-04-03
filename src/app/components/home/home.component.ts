import { Component, DoCheck, OnDestroy, OnInit, inject } from '@angular/core';
import { MeetupService } from '../../services/meetup.service';
import { Subject, takeUntil } from 'rxjs';
import { Meetup } from '../../interfaces/meetup';
import { MeetupCardComponent } from '../meetup-card/meetup-card.component';
import { NgFor, NgIf } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalTitle } from '../../enums/modal-title';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MeetupCardComponent, ModalComponent, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, DoCheck {
  public meetupService = inject(MeetupService);
  private _destroyer = new Subject();
  public meetups = [] as Meetup[];
  public ModalTitle = ModalTitle;

  public isModalOpen: boolean = false;
  public modalTitle: string = '';

  ngOnInit(): void {
    this.meetupService
      .fetchMeetups()
      .pipe(takeUntil(this._destroyer))
      .subscribe((data: Object) => {
        this.meetupService.setMeetups(data as Meetup[]);
        this.meetups = this.meetupService.getMeetups();
        console.log(this.meetups);
      });
  }

  ngDoCheck(): void {
    this.meetups = this.meetupService.getMeetups();
  }

  ngOnDestroy(): void {
    this._destroyer.complete();
    this.isModalOpen = false;
  }

  handleOpenModal(title: string = '') {
    this.modalTitle = title;
    this.isModalOpen = true;
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
}
