import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from '../enums/user-role';
import { REQUEST_INTERVAL } from '../constants/request-interval';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersInterval: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.loggedInToken().subscribe((token) => {
      if (token && this.authService.user.roles[0].name === UserRole.Admin) {
        this.fetchUsers();
        this.usersInterval = setInterval(() => {
          this.fetchUsers();
        }, REQUEST_INTERVAL);
      } else {
        clearInterval(this.usersInterval);
      }
    });
  }

  public users: User[] = [];

  private usersSubject = new BehaviorSubject<User[]>([]);

  baseUrl: string = `${environment.backendOrigin}/user`;

  fetchUsers() {
    return this.http
      .get<User[]>(this.baseUrl)
      .subscribe(
        (users) =>
          users.length !== this.users.length && this.usersSubject.next(users)
      );
  }

  loadUsers() {
    return this.usersSubject.asObservable();
  }

  setUsers(data: User[]) {
    this.users = data;
  }

  getUsers() {
    return this.users;
  }

  editUserData(id: number, data: Partial<User>) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  editUserRole(data: Partial<User>) {
    return this.http.post(`${this.baseUrl}/role`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
