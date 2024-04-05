import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  @Output()
  public handleSearchMeetups = new EventEmitter();

  searchForm!: FormGroup<{
    search: FormControl<string | null>;
  }>;

  initForm() {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.handleSearchMeetups.emit(this.searchForm.controls.search.value);
  }
}
