import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  authStore = inject(AuthStore);
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      const emailControl = this.loginForm.get('email');
      const userControl = this.loginForm.get('userId');
      if (emailControl?.errors) {
        this.errorMessage = 'אימייל לא תקין';
        return;
      }
      if (userControl?.errors) {
        this.errorMessage = 'שם משתמש הוא שדה חובה';
        return;
      }
    }

    this.errorMessage = null;
    this.loading = true;

    const loginData = this.loginForm.value;
   

    this.authStore.doLogin(loginData).subscribe({
      next: () => {
         this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
         this.errorMessage = err.error.message;
      },
    });
  }
}
