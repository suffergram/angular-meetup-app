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

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  @Output()
  public handleCloseModal = new EventEmitter();

  modalForm!: FormGroup<{
    title: FormControl<string | null>;
    date: FormControl<string | null>;
    time: FormControl<string | null>;
    location: FormControl<string | null>;
    duration: FormControl<number | null>;
    description: FormControl<string | null>;
    target: FormControl<string | null>;
    req: FormControl<string | null>;
    theme: FormControl<string | null>;
    reason: FormControl<string | null>;
  }>;

  initForm() {
    this.modalForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      location: ['', [Validators.required]],
      description: [''],
      duration: [0],
      target: [''],
      req: [''],
      theme: [''],
      reason: [''],
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
      duration: controls['duration'].value ?? 0,
      location: controls['location'].value ?? '',
      target_audience: controls['target'].value ?? '',
      need_to_know: controls['req'].value ?? '',
      will_happen: controls['theme'].value ?? '',
      reason_to_come: controls['reason'].value ?? '',
    };

    this.meetupService.postMeetup(data).subscribe((data: Object) => {
      this.meetupService.addMeetup(data as Meetup);
      this.handleCloseModal.emit();
    });
  }

  handleFormReset() {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }
}
