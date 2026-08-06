import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_STORAGE_KEY = 'f1sim_token';
const USERNAME_STORAGE_KEY = 'f1sim_username';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);

  // Holds the current JWT in memory as a signal, seeded from
  // localStorage so a page refresh doesn't log the user out.
  // Every part of the app that needs "am I logged in?" reads
  // `isAuthenticated()` instead of touching localStorage directly.
  private readonly token = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  readonly username = signal<string | null>(localStorage.getItem(USERNAME_STORAGE_KEY));

  // computed() re-derives automatically whenever `token` changes —
  // no need to update isAuthenticated manually in login()/logout().
  readonly isAuthenticated = computed(() => this.token() !== null);

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>('/api/auth/login', request).pipe(
      tap(response => this.storeSession(response))
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>('/api/auth/register', request).pipe(
      tap(response => this.storeSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    this.token.set(null);
    this.username.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(USERNAME_STORAGE_KEY, response.username);
    this.token.set(response.token);
    this.username.set(response.username);
  }
}
