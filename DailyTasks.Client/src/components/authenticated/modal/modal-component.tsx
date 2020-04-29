import { Component, h, Method, State } from '@stencil/core';

@Component({
    tag: 'modal-component',
    styleUrl: 'modal-component.scss'
})
export class ModalComponent {

    @State() modalClosed: boolean = true;

    @Method()
    async present() {
        this.modalClosed = false;
    }

    @Method()
    async dismiss() {
        this.modalClosed = true;
    }

    render() {
        return [
            <div class={`modal-body ${!this.modalClosed && 'modal-open'}`}>
                <slot></slot>
            </div>,
            <div onClick={() => this.dismiss()} class={`modal-backdrop ${!this.modalClosed && 'modal-open'}`}>
            </div>
        ]
    }
}