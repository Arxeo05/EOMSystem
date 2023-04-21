import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from './services/backend.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class RoleGuardGuard {
  constructor(private backend: BackendService) {}
  canActivate(): Observable<boolean> {
    return this.backend.userRole().pipe(
      map((data: { role: number }) => {
        if (data.role === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
