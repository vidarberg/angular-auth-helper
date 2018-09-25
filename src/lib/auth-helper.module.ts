import { NgModule, InjectionToken, Inject, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration, OidcConfigService, AuthWellKnownEndpoints, AuthConfiguration } from 'angular-auth-oidc-client';
import { SendToLoginComponent } from './send-to-login/send-to-login.component';
import { RedirectFromServerComponent } from './redirect-from-server/redirect-from-server.component';
import { SendToLogoutComponent } from './send-to-logout/send-to-logout.component';
export { SendToLoginComponent, RedirectFromServerComponent, SendToLogoutComponent };

const AuthorizationConfigService = new InjectionToken<AuthorizationConfig>("AuthorizationConfig");

export interface AuthorizationConfig {
  identityServer: string,
  client_id: string,
  scope: string,
  redirect_url: string,
  route_authorization_complete: string,
  route_logout_complete: string,
  route_not_authorized: string,
  route_access_denied: string,
  debug_mode: boolean
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule.forRoot()
  ],
  declarations: [
    SendToLoginComponent,
    SendToLogoutComponent,
    RedirectFromServerComponent
  ],
  providers: [
    OidcConfigService
  ],
  exports: [
    SendToLoginComponent,
    SendToLogoutComponent,
    RedirectFromServerComponent
  ]
})
export class AuthHelperModule {
  public static forRoot(config: AuthorizationConfig): ModuleWithProviders {
    return {
      ngModule: AuthHelperModule,
      providers: [
        {
          provide: AuthorizationConfigService,
          useValue: config
        }
      ]
    }
  }

  public constructor(
    @Inject(AuthorizationConfigService) private config: AuthorizationConfig,
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService
  ) {
    this.oidcConfigService.load_using_stsServer(config.identityServer);
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
      this.configureImplicitFlow(config);
    });
  }

  private configureImplicitFlow(config: AuthorizationConfig): void {
    const implicitFlow = new OpenIDImplicitFlowConfiguration();
    implicitFlow.stsServer = config.identityServer;
    implicitFlow.redirect_url = config.redirect_url;
    implicitFlow.client_id = config.client_id;
    implicitFlow.scope = config.scope
    implicitFlow.post_logout_redirect_uri = config.route_logout_complete;
    implicitFlow.post_login_route = config.route_authorization_complete;
    implicitFlow.forbidden_route = config.route_access_denied;
    implicitFlow.unauthorized_route = config.route_not_authorized;

    // Hard-coded well-meant values
    implicitFlow.response_type = "id_token token";
    implicitFlow.max_id_token_iat_offset_allowed_in_seconds = 60;

    if (config.debug_mode) {
      implicitFlow.log_console_warning_active = true;
      implicitFlow.log_console_warning_active = true;
    }

    const endPoints = new AuthWellKnownEndpoints();
    endPoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

    this.oidcSecurityService.setupModule(implicitFlow, endPoints);
  }
}
