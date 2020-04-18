import OIDC from 'oidc-client';
import env from '../env/env';

class AuthService {
    token = `${env.auth.clientId}-token`;

    authService: OIDC.UserManager = new OIDC.UserManager({
        scope: env.auth.scope,
        client_id: env.auth.clientId,
        authority: env.auth.authority,
        redirect_uri: env.auth.redirectUri,
        response_type: env.auth.responseType,
        post_logout_redirect_uri: env.auth.postLogoutRedirectUri,
        revokeAccessTokenOnSignout: env.auth.revokeAccessTokenOnSignout
    });

    constructor() {
        OIDC.Log.logger = console;

        this.authService.events.addUserLoaded((user: OIDC.User) => {
            this.setUser(user);
        });

        this.authService.events.addUserSignedOut(() => {
            this.removeUser();
        });
    }

    async verifyAuthentication() {
        let hasNewAuthToken = location.href.includes('#id_token');

        if (hasNewAuthToken) {
            let user = await this.authService.signinRedirectCallback();

            this.setUser(user);

            location.hash = '';

            return true;
        } else {
            let user = this.getUser();

            if (!user) {
                // if (location.origin != location.href && !location.href.includes('returnUrl')) {
                //     await this.authService.signinRedirect();
                // }

                return false;
            }

            return true;
        }
    }

    getUser(): OIDC.User {
        let user = localStorage.getItem(this.token);

        if (!user)
            return null

        return JSON.parse(user);
    }

    private removeUser() {
        localStorage.removeItem(this.token);
    }

    private setUser(user: OIDC.User) {
        localStorage.setItem(this.token, JSON.stringify(user));
    }
}

export default new AuthService();