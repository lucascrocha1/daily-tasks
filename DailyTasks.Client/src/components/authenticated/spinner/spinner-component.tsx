import { Component, h } from '@stencil/core';

@Component({
    tag: 'spinner-component',
    styleUrl: 'spinner-component.scss'
})
export class SpinnerComponent {

    //https://tobiasahlin.com/spinkit/
    render() {
        return (
            <div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
            </div>
        )
    }
}