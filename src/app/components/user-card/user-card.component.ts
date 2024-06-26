import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { UserRole } from '../../enums/user-role';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ModalComponent } from '../modal/modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, NgIf],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  @Input()
  user!: User;

  @Output()
  public deleteUser = new EventEmitter();

  public UserRole = UserRole;

  public disabled: boolean = true;

  public isModalOpen: boolean = false;

  userForm!: FormGroup<{
    email: FormControl<string | null>;
    fio: FormControl<string | null>;
    role: FormControl<string | null>;
  }>;

  initForm(
    values?: Partial<{
      email: string | null;
      fio: string | null;
      role: string | null;
    }>
  ) {
    const userRole = this.user.roles.reduce((accumulator, role) => {
      role.name === UserRole.Admin && (accumulator = role.name);
      return accumulator;
    }, UserRole.User);
    this.userForm = this.formBuilder.group({
      email: [
        { value: values?.email ?? this.user.email, disabled: this.disabled },
      ],
      fio: [{ value: values?.fio ?? this.user.fio, disabled: this.disabled }],
      role: [
        {
          value: values?.role ?? userRole,
          disabled: this.disabled,
        },
      ],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  handleSubmit() {
    this.disabled = !this.disabled;

    const value = this.userForm.value;

    if (this.user.email !== value.email || this.user.fio !== value.fio) {
      const data = {
        email: value.email,
        fio: value.fio,
      } as Partial<User>;
      this.userService.editUserData(this.user.id, data).subscribe(() => {
        this.user = {
          ...this.user,
          ...data,
        };
      });
    }

    if (this.user.roles[0].name !== value.role) {
      const data = {
        names: [value.role],
        userId: this.user.id,
      } as Partial<User>;
      this.userService.editUserRole(data).subscribe(() => {
        this.user.roles[0].name = value.role as string;
      });
    }

    this.initForm(value);
  }

  handleDelete() {
    this.deleteUser.emit(this.user.id);
  }

  handleModalOpen() {
    this.isModalOpen = true;
  }

  handleModalClose() {
    this.isModalOpen = false;
  }
}
