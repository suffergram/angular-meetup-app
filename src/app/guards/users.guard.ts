import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../enums/user-role';

export const usersGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.token) {
    if (authService.user.roles[0].name === UserRole.Admin) {
      return true;
    }

    return false;
  }

  router.navigate(['/login']);
  return false;
};
