import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getStoredUser();
      this.store.dispatch(AuthActions.loginSuccess({ user, token: localStorage.getItem('token') || '' }));
    }
  }

  title = 'fontend';
}
