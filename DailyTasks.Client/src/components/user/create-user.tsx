import { Component, h } from '@stencil/core';
import formValidation from '../../base/form-validation';

@Component({
    tag: 'create-user',
    styleUrl: 'create-user.scss'
})
export class CreateUser {

    state: any = {};

    form: HTMLFormElement;

    handleNameChange(e) {
        this.state.name = e.target.value;
    }

    handleEmailChange(e) {
        this.state.email = e.target.value;
    }

    handlePasswordChange(e) {
        this.state.password = e.target.value;
    }

    async submit(e) {
        e.preventDefault();

        formValidation.processRequest(this.form, async () => {
            
        });
    }

    render() {
        return (
            <div class="create-user-page">
                <div class="container">
                    <div class="card-background">
                        <div class="logo">
                            <span class="logo-title">
                                Oiksat
                            </span>
                        </div>
                        <div class="card">
                            <form ref={e => this.form = e as any} novalidate onSubmit={(e) => this.submit(e)}>
                                <div class="user-picture">
                                    <img class="add-user-svg" src="/assets/svg/add-user.svg"></img>
                                    <span>Select your picture.</span>
                                </div>
                                <div class="input-outlined">
                                    <input
                                        required
                                        name="name"
                                        placeholder="Your name"
                                        class="input"
                                        onChange={(e => this.handleNameChange(e))}
                                        type="text">
                                    </input>
                                    <label class="label">Name</label>
                                    <error-message name="name"></error-message>
                                </div>
                                <div class="input-outlined">
                                    <input
                                        required
                                        name="email"
                                        placeholder="Your email"
                                        class="input"
                                        onChange={(e => this.handleNameChange(e))}
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
                                        onChange={(e => this.handleNameChange(e))}
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
                    </div>
                </div>
            </div>
        )
    }
}