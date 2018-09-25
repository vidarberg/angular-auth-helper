import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {

  constructor(private oidcSecurityService: OidcSecurityService) {
  }

  public getToken(): string {
    return this.oidcSecurityService.getToken();
  }

  public getIdToken(): string {
    return this.oidcSecurityService.getIdToken();
  }
}
