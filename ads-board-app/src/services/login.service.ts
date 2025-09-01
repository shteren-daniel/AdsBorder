import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Login } from '../models/login.model';

interface ApiResponse<T> {
  success: boolean;
  forUser: boolean;
  message?: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}

  login(login: Login): Observable<Login> {
    return this.http.post<ApiResponse<Login>>(`${environment.apiUrl}/login`, login).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'שגיאה בכניסה למערכת');
        return res.data!;
      })
    );
  }
}
