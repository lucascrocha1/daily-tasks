import { Component, h } from '@stencil/core';

@Component({
	tag: 'app-root',
	styleUrl: 'app-root.scss'
})
export class AppRoot {
	renderMenu() {
		return [
			<div class="menu-item">
				<div class="img-menu-background">
					<img class="img-menu" src="/assets/svg/tag.svg"></img>
				</div>
				<div class="menu-text">
					Categories
				</div>
			</div>
		];
	}

	render() {
		return [
			<div class="container">
				<header-component></header-component>
				<div class="content-root">
					{/* <div class="side-menu side-menu-collapsable">
						{this.renderMenu()}
					</div> */}
					<div class="content-page">
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
				</div>
			</div>
		];
	}
}
