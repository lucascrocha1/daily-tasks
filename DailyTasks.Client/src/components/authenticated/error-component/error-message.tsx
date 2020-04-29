import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'error-message'
})
export class ErrorMessage {

    @Prop({ reflectToAttr: true }) name: string;

    @Prop() message: string;

    render() {
        return (
            <div id={this.name} class="span-error">{this.message}</div>
        )
    }
}