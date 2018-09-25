import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  templateUrl: './redirect-from-server.component.html'
})
export class RedirectFromServerComponent implements OnInit, OnDestroy {
  constructor(private oidcSecurityService: OidcSecurityService) {
  }

  ngOnInit() {
    if (this.oidcSecurityService.moduleSetup) {
      this.handleCallback();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.handleCallback();
      });
    }
  }

  ngOnDestroy(): void {
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  private handleCallback(): void {
    if (window.location.hash) {
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
