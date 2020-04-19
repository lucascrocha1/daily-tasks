import jwt_decode from 'jwt-decode';

class AuthService {
    token = 'auth_token_daily_task';

    getDecodedToken() {
        let token = this.getToken();

        if (!token)
            return null;

        let tokenDecoded = jwt_decode(token);

        console.log(tokenDecoded);

        return tokenDecoded;
    }

    getToken() {
        let token = localStorage.getItem(this.token);

        if (!token)
            return null;

        return JSON.parse(token);
    }

    setToken(token: string) {
        localStorage.setItem(this.token, JSON.stringify(token));
    }

    removeToken() {
        localStorage.removeItem(this.token);
    }
}

export default new AuthService();