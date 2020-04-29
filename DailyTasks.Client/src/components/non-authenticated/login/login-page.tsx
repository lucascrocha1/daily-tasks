import { Component, h } from '@stencil/core';

@Component({
    tag: 'login-page',
    styleUrl: 'login-page.scss'
})
export class LoginPage {
    renderLoginCard() {
        return (
            <div class="card">
                <div>
                    <div class="input-outlined">
                        <input
                            required
                            name="title"
                            placeholder="Title of the task"
                            value=""
                            class="input"
                            type="email">
                        </input>
                        <label class="label">Email</label>
                        <error-message name="title"></error-message>
                    </div>
                    <div class="input-outlined">
                        <input
                            required
                            name="title"
                            placeholder="Title of the task"
                            value=""
                            class="input"
                            type="password">
                        </input>
                        <label class="label">Password</label>
                        <error-message name="title"></error-message>
                    </div>
                    <div>
                        <button type="submit" class="btn-login">LOGIN</button>
                    </div>
                </div>
            </div>
        )
    }

    renderSideWave() {
        return (
            <div class="wave-background" style={{ "height": "100vh", "overflow": "hidden" }}>
                <svg viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                    style={{ "height": "100%", "width": "100%" }}>
                    <path d="M208.08,0.00 C152.69,67.09 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z"
                        style={{ "stroke": "none", "fill": "#60EFFF" }}>
                    </path>
                </svg>
            </div>
        )
    }

    renderSidePage() {
        return (
            <div>
                <img src="/assets/svg/login-svg.svg" class="login-svg"></img>
            </div>
        )
    }

    render() {
        return (
            <div class="login-background">
                {this.renderSideWave()}
                <div class="container-login">
                    {this.renderSidePage()}
                    {this.renderLoginCard()}
                </div>
            </div>
        )
    }
}