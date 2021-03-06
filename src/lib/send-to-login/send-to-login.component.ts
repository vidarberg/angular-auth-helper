import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  templateUrl: './send-to-login.component.html'
})
export class SendToLoginComponent implements OnInit, OnDestroy {
  constructor(private oidcSecurityService: OidcSecurityService) {
  }

  ngOnInit(): void {
    if (this.oidcSecurityService.moduleSetup) {
      this.configurationLoaded();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.configurationLoaded();
      });
    }
  }

  ngOnDestroy(): void {
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  private configurationLoaded(): void {
    this.oidcSecurityService.authorize();
  }
}
