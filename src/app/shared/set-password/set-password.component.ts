import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';
import { ChangepasswordService } from 'src/app/user/views/changepassword/changepassword.service';
import {IMAGES} from '../constants/images.constant'
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
  public images=IMAGES;
  passwordChangeForm!: FormGroup;
  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;

  newPass = false;
  conPass = false;
  passwordIsValid = false;

  constructor(
    private formBuilder: FormBuilder,
    private change_password_service: ChangepasswordService,
    private messageService1: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.passwordChangeForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.checkingPasswords });
  }

  public checkingPasswords(formGroup: FormGroup) {
    if (
      formGroup.controls.newPassword.value &&
      formGroup.controls.confirmPassword.value &&
      formGroup.controls.newPassword.value.length >= 8 &&
      formGroup.controls.confirmPassword.value.length >= 8
    ) {
      return formGroup.controls.newPassword.value === formGroup.controls.confirmPassword.value ? false : { "notMatched": true }
    }
    return false;
  }

  checkValidations(control, type) {
    switch (type) {
      case 'special-character':
        return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(control.value);;
      case 'number':
        return /\d/.test(control.value);
      case 'lowercase':
        return /[a-z]/.test(control.value);
      case 'uppercase':
        return /[A-Z]/.test(control.value);
      case 'length':
        return control.value.length >= 8;
      default:
        return false
    }
  }

  passwordValid(event) {
    this.passwordIsValid = event;
  }

  submitForm() {
    if (this.passwordChangeForm.invalid) {
      this.passwordChangeForm.markAllAsTouched();
    } else {
      const { newPassword, confirmPassword } = this.passwordChangeForm.value;

      this.change_password_service.setPassword(newPassword, confirmPassword).pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);
          return []; // Return an empty array or a default value to handle the error gracefully
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: data.message });
          this.router.navigate(['/']);

          this.passwordChangeForm.reset();
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Password change failed. Please try again.' });
        }
      });
    }
  }

  gotoNext(route: any) {
    this.router.navigate([`/${route}`]);
  }

}
