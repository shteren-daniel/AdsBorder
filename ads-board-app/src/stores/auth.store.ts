import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Login } from '../models/login.model';
import { LoginService } from '../services/login.service';
import { inject, computed } from '@angular/core';
import { tap } from 'rxjs';

export interface AuthState {
  login: Login | null;
}

const initialState: AuthState = { login: null };

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    userId: computed(() => state.login()?.userId ?? null),
    isLoggedIn: computed(() => !!state.login()?.token && !!state.login()?.userId)
  })),

  withMethods((store) => {
    const loginService = inject(LoginService);
    return {
      doLogin(loginData: Login) {
        return loginService.login(loginData).pipe(
          tap((res: Login) => patchState(store, { login: res }))
        );
      },
      logout() {
        patchState(store, { login: null });
      },
    };
  })
);
