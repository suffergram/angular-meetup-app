import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MeetupService } from '../../services/meetup.service';
import { Meetup } from '../../interfaces/meetup';
import { locationValidator } from '../../validators/location.validator';
import { ModalComponent } from '../modal/modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, NgIf],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private meetupService: MeetupService
  ) {}

  @Input()
  title!: string;

  @Input()
  meetup?: Meetup = undefined;

  @Output()
  public handleFormClose = new EventEmitter();

  public isModalOpen: boolean = false;

  modalForm!: FormGroup<{
    title: FormControl<string | null>;
    date: FormControl<string | null>;
    time: FormControl<string | null>;
    location: FormControl<string | null>;
    duration: FormControl<string | null>;
    description: FormControl<string | null>;
    target: FormControl<string | null>;
    req: FormControl<string | null>;
    theme: FormControl<string | null>;
    reason: FormControl<string | null>;
  }>;

  initForm(meetup?: Meetup) {
    const date =
      meetup &&
      new Date(meetup.time).toLocaleString('fr-CA', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    const time = meetup && new Date(meetup.time).toLocaleTimeString('ru');

    this.modalForm = this.formBuilder.group({
      title: [meetup?.name ?? '', [Validators.required]],
      date: [date ?? '', [Validators.required]],
      time: [time ?? '', [Validators.required]],
      location: [
        meetup?.location ?? '',
        [Validators.required, locationValidator()],
      ],
      description: [meetup?.description ?? ''],
      duration: [meetup?.duration.toString() ?? ''],
      target: [meetup?.target_audience ?? ''],
      req: [meetup?.need_to_know ?? ''],
      theme: [meetup?.will_happen ?? ''],
      reason: [meetup?.reason_to_come ?? ''],
    });
  }

  handleFormSubmit() {
    if (this.modalForm.invalid) return;

    const controls = this.modalForm.controls;

    const resDate = new Date(
      controls['date'].value + ':' + controls['time'].value
    ).toJSON();

    const data: Partial<Meetup> = {
      name: controls['title'].value ?? '',
      description: controls['description'].value ?? '',
      time: resDate,
      duration: Number(controls['duration'].value) ?? 0,
      location: controls['location'].value ?? '',
      target_audience: controls['target'].value ?? '',
      need_to_know: controls['req'].value ?? '',
      will_happen: controls['theme'].value ?? '',
      reason_to_come: controls['reason'].value ?? '',
    };

    if (!this.meetup) {
      this.meetupService.postMeetup(data).subscribe((data: Object) => {
        this.meetupService.addMeetup(data as Meetup);
        this.handleFormClose.emit();
      });
    } else {
      this.meetupService
        .editMeetup(this.meetup.id, data)
        .subscribe((data: Object) => {
          this.meetupService.changeMeetup(data as Partial<Meetup>);
          this.handleFormClose.emit();
        });
    }
  }

  handleFormReset() {
    this.initForm(this.meetup);
  }

  ngOnInit(): void {
    this.initForm(this.meetup);
  }

  handleModalOpen() {
    this.isModalOpen = true;
  }

  handleModalClose() {
    this.isModalOpen = false;
  }
}
