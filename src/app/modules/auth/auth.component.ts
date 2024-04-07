import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  BehaviorSubject,
} from 'rxjs';
import { User } from 'src/app/model/user.model';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnDestroy {
  form = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  retryTimerVal: number = 60;

  private _userInfo$: Subject<User | null> = new Subject();
  userInfo$: Observable<User | null> = this._userInfo$.asObservable();

  private _error$: Subject<string | null> = new Subject<string | null>();
  error$: Observable<string | null> = this._error$.asObservable();

  private _timer$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  timer$: Observable<number> = this._timer$.asObservable();

  timeoutId: ReturnType<typeof setTimeout> | undefined;
  intervalId: ReturnType<typeof setInterval> | undefined;

  private _destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ngZone: NgZone,
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
  }

  auth() {
    if (this.form.invalid) {
      return;
    }

    this.form.disable();
    this._userInfo$.next(null);

    this.authService.login()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user) => {
          this.form.enable();
          this._userInfo$.next(user);
        },
        error: (error) => {
          this._error$.next(error.error.message);
          this.setTimeoutErrorShow();
          this.runTimer();
        },
      });
  }

  private runTimer() {
    this.ngZone.runOutsideAngular(() => {
      this._timer$.next(this.retryTimerVal);

      let timer = this.retryTimerVal;
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          timer--;
          this._timer$.next(timer);

          if (timer === 0) {
            this.form.enable();
            clearInterval(this.intervalId);
          }
        });
      }, 1000);
    });
  }

  private setTimeoutErrorShow() {
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(
        () => this.ngZone.run(() => {
          this._error$.next(null);
          clearTimeout(this.timeoutId);
        }),
        5000
      );
    });
  }
}
