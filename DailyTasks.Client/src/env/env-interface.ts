export interface Enviroment {
	apiUrl: string,
	auth: {
		scope: string,
		clientId: string,
		authority: string,
		redirectUri: string,
		responseType: string,
		postLogoutRedirectUri: string,
		revokeAccessTokenOnSignout: boolean
	}
}