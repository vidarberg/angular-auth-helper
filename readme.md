## Angular Authentication Helper 

This library contains helpers for dealing with authentication using OAuth2 and the excellent package angular-auth-oidc-client from damienbod.

### Getting Started

To use this package, install it like this:

```
npm install --save @vibesoftware/auth-helper
```

After that, import it into your app.module like this:

```typescript
import { 
    AuthHelperModule, 
    SendToLoginComponent, 
    SendToLogoutComponent, 
    RedirectFromServerComponent 
} from '@vibesoftware/auth-helper';
```

Then, configure the identity server and behavior like this:

```typescript
@NgModule({
    // ...
    imports: [
        RouterModule.forRoot([
        {   // This component performs the authorization (and potential redirect to auth server) 
            path: '/',
            component: SendToLoginComponent
        },
        {   // This component performs logout
            path: '/logout',
            component: SendToLogoutComponent
        },
        {   // This handles the return callback from the auth server
            path: '/redirect-from-auth-server',
            component: RedirectFromServerComponent
        },

        // The following components you need to make.
        {  
            path: "/home-page", // When you get to this route, the authentication is completed.
            component: HomeComponent
        },
        {
            path: "/logged-out",
            component: RandomComponent
        },
        {
            path: "/unauthorized",
            component: RandomComponent
        },
        {
            path: "/access-denied",
            component: RandomComponent
        }
        ]),
        AuthHelperModule.forRoot({
            debug_mode: false,
            identityServer: 'https://auth.domain.com',
            client_id: 'MyGui',
            scope: 'blog:read',
            redirect_url: 'https://www.myblog.com/redirect-from-auth-server',
            route_authorization_complete: '/home-page',
            route_logout_complete: '/logged-out',
            route_not_authorized: '/unauthorized',
            route_access_denied: '/access-denied',
        })
        // ...
    ]
```

Now you can create a HomeComponent and get the access- and id-token like this:

```typescript
    constructor(private auth: AuthHelperService) {
        let accessToken = auth.getToken();
        let idToken = auth.getIdToken();
    }
```