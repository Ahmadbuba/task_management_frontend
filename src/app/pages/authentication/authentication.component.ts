import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  RegisterPayload,
  LoginPayload,
  AuthenticationService,
} from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  activeForm!: FormGroup;
  isSignupMode = false;

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.activeForm = this.loginForm; // Default form is login
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.activeForm = this.isSignupMode ? this.signupForm : this.loginForm;
  }

  onSubmit() {
    if (!this.activeForm.valid) {
      console.warn('Form submission prevented: invalid form.');
      return;
    }
    if (this.isSignupMode) {
      this.registerUser();
    } else {
      this.loginUser();
    }
  }

  registerUser() {
    const payload: RegisterPayload = this.signupForm.value;
    this.authService.register(payload).subscribe(
      (response) => {
        console.log('Registration successful!', response);
        // Switch to login mode and clear form data after successful registration
        this.activeForm.reset();
        this.toggleMode();
      },
      (error) => {
        console.error('Registration failed:', error);
        // Handle registration errors (e.g., display error message to user)
        if (error.status === 409) {
          // Handle conflict error (user already exists)
          // Inform user that email already exists and suggest login
          console.warn('Email already exists. Please try logging in.');
          this.activeForm.reset();
          this.toggleMode(); // Switch to login mode
        }
      }
    );
  }

  loginUser() {
    const payload: LoginPayload = this.loginForm.value;
    this.authService.login(payload).subscribe(
      (response) => {
        console.log('Login successful!', response);
        this.router.navigate(['/dashboard']);
        this.activeForm.reset();
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle login errors (e.g., display error message to user)
        if (error.status === 401) {
          // Handle unauthorized error (user not found)
          console.warn(
            'Invalid credentials. Please check your email and password.'
          );
          this.activeForm.reset();
          this.toggleMode();
        } else if (error.status === 400) {
          // Handle badcredentails error (validation error, wrong password)
          console.warn(
            'Bad credentials. Please check your email and password and make sure they valid and correct.'
          );
        }
        this.activeForm.reset();
      }
    );
  }
}
