import { Component, h, State } from '@stencil/core';
import authService from '../../base/auth-service';

@Component({
	tag: 'app-root',
	styleUrl: 'app-root.scss'
})
export class AppRoot {

	@State() isAuthenticated: boolean = false;

	async componentWillLoad() {
		this.isAuthenticated = await authService.verifyAuthentication();
		
		if (!this.isAuthenticated)
			return;
	}

	renderAuthenticatedRoutes() {
		return [
			<stencil-route url='/' component='daily-task-list' exact={true} />,
			<stencil-route url='/insert' component='daily-task-insert-edit' />,
			<stencil-route url='/edit/:taskId' component='daily-task-insert-edit' />
		]
	}

	renderNonAuthenticatedRoutes() {
		return [
			<stencil-route url='/' component='login-page' exact={true} />,
			<stencil-route url='/create/user' component='create-user'></stencil-route>
		]
	}

	render() {
		return [
			<main>
				<stencil-router>
					<stencil-route-switch scrollTopOffset={0}>
						{
							this.isAuthenticated
								? this.renderAuthenticatedRoutes()
								: this.renderNonAuthenticatedRoutes()
						}
					</stencil-route-switch>
				</stencil-router>
			</main>
		];
	}
}