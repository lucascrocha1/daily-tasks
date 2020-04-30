import { Component, h, Event } from '@stencil/core';
import { EventEmitter } from '@stencil/router/dist/types/stencil.core';

@Component({
    tag: 'register-page',
    styleUrl: 'register-page.scss'
})
export class RegisterPage {
    @Event() pageChange: EventEmitter;

    renderLoginCard() {
        return (
            <div class="card">
                <div>
                    <div class="input-outlined">
                        <input
                            required
                            name="email"
                            placeholder="Your email."
                            value=""
                            class="input"
                            type="email">
                        </input>
                        <label class="label">Email</label>
                        <error-message name="email"></error-message>
                    </div>
                    <div class="input-outlined">
                        <input
                            required
                            name="password"
                            placeholder="Your password."
                            value=""
                            class="input"
                            type="password">
                        </input>
                        <label class="label">Password</label>
                        <error-message name="password"></error-message>
                    </div>
                    <div>
                        <button type="submit" class="btn-login">LOGIN</button>
                    </div>
                </div>
            </div>
        )
    }

    renderSidePage() {
        return (
            <div>
                <div>
                    <span>A simple way to control your day.</span>
                    <img src="/assets/svg/login-svg.svg" class="login-svg"></img>
                </div>
            </div>
        )
    }

    render() {
        return [
            <div>
                {this.renderSidePage()}
                {this.renderLoginCard()}
                <a onClick={() => this.pageChange.emit()}>login</a>
            </div>
        ]
    }
}