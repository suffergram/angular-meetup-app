import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  form!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    fio: FormControl<string | null>;
  }>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  private router: Router = inject(Router);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      fio: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const email = this.form.value.email;
    const password = this.form.value.password;
    const fio = this.form.value.fio;
    email &&
      password &&
      fio &&
      this.authService.signup(email, password, fio).subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
