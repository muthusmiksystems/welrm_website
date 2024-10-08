import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export enum toastTypes {
  error,
  success,
}

export interface ToastData {
  title: string;
  content: string;
  show?: boolean;
  type?: toastTypes;
  progressWidth?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private toastr: ToastrService) {}
  data!: ToastData;
  public open = new Subject<ToastData>();

  initiate(data: ToastData) {
    if (data.type) {
      this.data.type = toastTypes.error;
    }
    this.data = { ...data, show: true, progressWidth: '100%' };
    this.open.next(this.data);
  }

  hide() {
    this.data = { ...this.data, show: false };
    this.open.next(this.data);
  }


}
