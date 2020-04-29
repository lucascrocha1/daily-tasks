import { Component, h, State, Method } from '@stencil/core';

@Component({
    tag: 'loader-component',
    styleUrl: 'loader-component.scss'
})
export class LoaderComponent {

    @State() loaderHidden = true;

    @Method()
    async show() {
        this.loaderHidden = false;
    }

    @Method()
    async dismiss() {
        this.loaderHidden = true;
    }

    render() {
        return [
            <div class={`loader-body ${!this.loaderHidden && 'loader-open'}`}>
                <spinner-component></spinner-component>
            </div>,
            <div class={`loader-backdrop ${!this.loaderHidden && 'loader-backdrop-open'}`}>
            </div>
        ]
    }
}