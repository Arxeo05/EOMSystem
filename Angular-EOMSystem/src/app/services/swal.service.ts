import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  swalSucces(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message
    });
  }

  swalInfo(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Info',
      text: message
    });
  }

  swalWarning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message
    });
  }

  swalError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}
