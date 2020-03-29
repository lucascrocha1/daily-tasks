import { Component, h } from '@stencil/core';


@Component({
	tag: 'app-root'
})
export class AppRoot {

	render() {
		return [
			<div class="container">
				<header-component></header-component>
				<main>
					<stencil-router>
						<stencil-route-switch scrollTopOffset={0}>
							<stencil-route url='/' component='daily-task-list' exact={true} />
							<stencil-route url='/insert' component='daily-task-insert-edit' />
							<stencil-route url='/edit/:taskId' component='daily-task-insert-edit' />
						</stencil-route-switch>
					</stencil-router>
				</main>
			</div>
		];
	}
}
