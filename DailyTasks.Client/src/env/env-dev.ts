import { Enviroment } from "./env-interface";

const env: Enviroment = {
	apiUrl: 'https://localhost:44319/',
	auth: {
		clientId: 'daily-task-client',
		responseType: 'id_token token',
		revokeAccessTokenOnSignout: true,
		redirectUri: 'http://localhost:3333',
		authority: 'https://localhost:44319/',
		scope: 'openid profile daily-task-login',
		postLogoutRedirectUri: 'http://localhost:3333',
	}
}

export default env;