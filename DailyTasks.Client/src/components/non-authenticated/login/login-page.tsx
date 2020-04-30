import { Component, h, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'login-page',
    styleUrl: 'login-page.scss'
})
export class LoginPage {
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

    renderLinks() {
        return (
            <div>
                <span onClick={() => this.pageChange.emit()}>registrar</span><br/>
                <span onClick={() => this.pageChange.emit()}>esqueci minha senha</span>
            </div>
        )
    }

    renderSidePage() {
        return (
            <div>
                <div>
                    <span class="simple-way-text">A simple way to control your day.</span>
                </div>
                <div>
                    <img src="/assets/svg/login-svg.svg" class="login-svg"></img>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div class="login-background">
                <div class="side-page-background">
                    {this.renderSidePage()}
                </div>
                <div class="login-side-background">
                    {this.renderLoginCard()}
                    {this.renderLinks()}
                </div>
            </div>
        )
    }
}