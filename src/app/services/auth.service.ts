import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuth$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuth$: Observable<boolean> = this._isAuth$.asObservable();

  constructor(private http: HttpClient) {}

  login(): Observable<User> {
    return of(Math.random()).pipe(
      switchMap(val => {
        return this.http.get<User>(
          `${environment.api_url}/${val > 0.5 ? 'users/me' : 'user/1'}`
        );
      }),
    );
  }
}
