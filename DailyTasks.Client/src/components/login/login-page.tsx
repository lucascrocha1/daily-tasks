import { Component, h } from '@stencil/core';
import formValidation from '../../base/form-validation';
import loginService from './login-service';

@Component({
    tag: 'login-page'
})
export class LoginPage {
    form: HTMLFormElement;

    state: any = {};

    async submit(e) {
        e.preventDefault();

        let returnUrl = location.href.substring(location.href.indexOf('returnUrl'), location.href.length).replace('returnUrl=', '');

        this.state.returnUrl = returnUrl;

        formValidation.processRequest(this.form, async () => {
            await loginService.login(this.state);
        });
    }

    handleEmailChange(e) {
        this.state.email = e.target.value;
    }

    handlePasswordChange(e) {
        this.state.password = e.target.value;
    }

    render() {
        return (
            <div>
                <form ref={e => this.form = e as any} novalidate onSubmit={(e) => this.submit(e)}>
                    <div class="input-outlined">
                        <input
                            required
                            name="email"
                            placeholder="Your email"
                            class="input"
                            onChange={(e => this.handleEmailChange(e))}
                            type="email">
                        </input>
                        <label class="label">Email</label>
                        <error-message name="email"></error-message>
                    </div>
                    <div class="input-outlined">
                        <input
                            required
                            name="password"
                            placeholder="Password"
                            class="input"
                            onChange={(e => this.handlePasswordChange(e))}
                            type="password">
                        </input>
                        <label class="label">Password</label>
                        <error-message name="password"></error-message>
                    </div>
                    <div class="btn-background">
                        <button type="submit" class="btn-confirm">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}