import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public users: User[] = [];

  baseUrl: string = `${environment.backendOrigin}/user`;

  fetchUsers() {
    return this.http.get(this.baseUrl);
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
