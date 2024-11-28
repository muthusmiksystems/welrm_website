import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangepasswordService } from './changepassword.service';
import { catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import {IMAGES} from "../../../shared/constants/images.constant";
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
})
export class ChangepasswordComponent implements OnInit {
  public images=IMAGES;
  passwordChangeForm!: FormGroup;
  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;
  
  currPass = false;
  newPass = false;
  conPass = false;
  passwordIsValid = false;

  constructor(
    private formBuilder: FormBuilder,
    private change_password_service: ChangepasswordService,
    private messageService1: MessageService
  ) {}

  ngOnInit(): void {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.checkingPasswords });

    console.log('this.passwordChangeForm: ', this.passwordChangeForm.hasError("notMatched"));
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

          this.passwordChangeForm.reset();
        } else {
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Password change failed. Please try again.' });
        }
      });
    }
  }

  changePassword() {
    if (!this.passwordChangeForm.valid) {
      //alert('Please fill in both the new password and confirm password fields.'  );

      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Please fill in both the new password and confirm password fields.' });


      return;
    }

    const { newPassword, confirmPassword } = this.passwordChangeForm.value;

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      //alert('Password must be at least 8 characters long.');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Password must be at least 8 characters long.' });

      return;
    }

    if (newPassword !== confirmPassword) {
      //alert('New Password and Confirm Password should be the same.');
      this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'New Password and Confirm Password should be the same.' });

      return;
    }

    this.change_password_service
      .setPassword(newPassword, confirmPassword)
      .pipe(
        catchError((error: any) => {
          // Handle the error here, e.g., display an error message
          console.error('Error occurred:', error);

          return []; // Return an empty array or a default value to handle the error gracefully
        })
      )
      .subscribe((data: any) => {
        if (data.success) {
          //alert(data.message);
          this.messageService1.add({ severity: 'success', summary: 'Success', detail: data.message });


          // Optionally, you can reset the form here
          this.passwordChangeForm.reset();
        } else {
          //alert('Password change failed. Please try again.');
          this.messageService1.add({ severity: 'error', summary: 'Error', detail: 'Password change failed. Please try again.' });

        }
      });
  }
}
