import { Component, h, State, Listen } from '@stencil/core';

@Component({
    tag: 'home-page',
    styleUrl: 'home-page.scss'
})
export class HomePage {
    @State() isLogin: boolean = true;

    @State() isAnimating: boolean = false;

    @Listen('pageChange')
    pageChangeHandler() {
        this.isLogin = !this.isLogin;
        this.isAnimating = true;

        setTimeout(() => this.isAnimating = false, 2000);
    }

    renderSideWaveLogin() {
        return (
            <div class="wave-background" style={{ "height": "100vh", "overflow": "hidden" }}>
                <svg viewBox="0 0 400 150"
                    preserveAspectRatio="none"
                    style={{ "height": "100%", "width": "100%" }}>
                    <path d="M208.08,0.00 C152.69,67.09 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z"
                        style={{ "stroke": "none", "fill": "#60EFFF" }}>
                    </path>
                </svg>
            </div>
        )
    }

    renderSideWaveRegister() {
        return (
            <div class="wave-background" style={{ "height": "100vh", "overflow": "hidden" }}>
                <svg viewBox="0 0 400 150"
                    preserveAspectRatio="none"
                    style={{ "height": "100%", "width": "100%" }}>
                    <path d="M213.19,0.00 C152.69,70.06 270.03,70.06 202.98,150.00 L500.00,150.00 L500.00,0.00 Z"
                        style={{ "stroke": "none", "fill": "#00FF87" }}>
                    </path>
                </svg>
            </div>
        )
    }

    renderWave() {
        if (this.isLogin)
            return this.renderSideWaveLogin();
        else
            return this.renderSideWaveRegister();
    }

    renderBody() {
        if (this.isLogin)
            return <login-page></login-page>
        else
            return <register-page></register-page>
    }

    renderAnimation() {
        let animateClass = this.isLogin ? 'animate-left' : 'animate-right';

        return (
            <div class={`home-page-animate ${this.isAnimating && animateClass}`}>                
            </div>
        )
    }

    render() {
        return (
            <div class="home-background">
                {this.renderWave()}
                {this.renderAnimation()}
                <div class="container-home">
                    {this.renderBody()}
                </div>
            </div>
        )
    }
}