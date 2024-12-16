import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environment';

@Component({
  selector: 'app-personal-detail',
  templateUrl: './personal-detail.component.html',
  styleUrls: ['./personal-detail.component.scss'],
})
export class PersonalDetailComponent {
  personalDetailForm: FormGroup;
  private baseUrl: string = environment.apiUrl + 'user-management';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.personalDetailForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.fetchPersonalDetails();
  }

  fetchPersonalDetails(): void {
    this.http.get(`${this.baseUrl}/me`).subscribe((response: any) => {
      this.personalDetailForm.patchValue({
        name: response.name,
        email: response.email,
      });
    });
  }

  updatePersonalDetails(): void {
    const updatedDetails = this.personalDetailForm.value;
    this.http.put(`${this.baseUrl}`, updatedDetails).subscribe(() => {
      alert('Details updated successfully');
    });
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
