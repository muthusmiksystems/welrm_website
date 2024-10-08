import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
AuthService

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  constructor(private auth_service: AuthService) { }

  ngOnInit(): void {
  }
  confirmAlert(): void {
    const result = window.confirm('Are you sure you want to delete your account?');
    if (result) {
      this.deleteAccount();
    }
  }

  deleteAccount(): void {
   this.auth_service.accountDelete().subscribe((response:any) => {
    if (response.success) {
      if (response.code === 200) {
        alert(response.message)
      }
      else{
        alert('success 200 but code error');
      }
    }
    else{
      alert('Success Error');
    }
   })
  }

}
