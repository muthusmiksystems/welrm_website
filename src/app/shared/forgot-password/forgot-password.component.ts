import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = new FormControl()
  // loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private auth_service: AuthService,
  ) { }

  ngOnInit() {
  }

  submit() {
    console.log("data-", this.email.value)
    this.auth_service
        .forgotpassword(this.email.value)
        .subscribe((data) => {
          console.log("data-", data)

         
        });
  }
}
