class FormValidation {
    async processRequest(form: HTMLFormElement, action: () => any) {
        this.clearErrors(form);

        let formValid = this.validateForm(form);

        if (!formValid) {
            // ToDo: show a toast with red background
            return;
        }

        try {
            await this.showLoader();

            let result = action();

            if (result && 'then' in result)
                await result;
        } catch (error) {
            if (error && error.status == 400)
                this.processFormStatus400(form, error.data);

            await this.dismissLoader();
        }
    }

    private processFormStatus400(form: HTMLFormElement, error: any) {
        this.clearErrors(form);

        let messages = this.getServerErrors(error);

        if (!messages)
            return;

        for (let message of messages)
            this.setError(form, message.elementName, message.message);
    }

    private getServerErrors(error: any) {
        if (!error || !error.errors)
            return null;

        let result = [];

        for (let key in error.errors) {
            let message = error.errors[key];

            if (!message)
                continue;

            let elementName = this.getElementName(key);

            result.push({ elementName, message: message[0] })
        }

        return result;
    }

    private getElementName(key: string) {
        return key.substring(0, 1).toLowerCase() + key.substring(1, key.length - 1);
    }

    private async showLoader() {
        let loaderController = document.querySelector('loader-component');

        if (loaderController)
            await loaderController.show();
    }

    private async dismissLoader() {
        let loaderController = document.querySelector('loader-component');

        if (loaderController)
            await loaderController.dismiss();
    }

    private validateForm(form: HTMLFormElement) {
        let elements = this.getElements(form);

        let inputValid = this.validateRequiredElements(form, elements.inputs);
        let selectValid = this.validateRequiredElements(form, elements.selects);
        let textareaValid = this.validateRequiredElements(form, elements.textareas);

        if (!inputValid || !selectValid || !textareaValid)
            return false;

        return true;
    }

    private getElements(form: HTMLFormElement) {
        let inputs = form.getElementsByTagName('input');
        let textareas = form.getElementsByTagName('textarea');
        let selects = form.getElementsByTagName('select');

        return { inputs, textareas, selects };
    }

    private validateRequiredElements(form: HTMLFormElement, elements: HTMLCollectionOf<HTMLInputElement> | HTMLCollectionOf<HTMLSelectElement> | HTMLCollectionOf<HTMLTextAreaElement>) {
        if (!elements)
            return true;

        let valid = true;

        // ToDo: change the error message
        for (let element of elements as any) {
            if (element.type == 'checkbox' && element.required && !element.checked) {
                this.setError(form, element.name, 'Por favor, preencha o campo acima.');
                valid = false;
            } else if (element.required && !element.value) {
                this.setError(form, element.name, 'Por favor, preencha o campo acima.');
                valid = false;
            }
        }

        return valid;
    }

    clearErrors(form: HTMLFormElement) {
        let elements = form.querySelectorAll('error-message');

        for (let element of elements as any) {
            this.changeErrorInput(element, false);
            element.message = null;
        }
    }

    private changeErrorInput(errorElement: HTMLErrorMessageElement, add: boolean) {
        let inputOutlinedElement = errorElement.closest('.input-outlined');

        if (inputOutlinedElement) {
            let input = inputOutlinedElement.querySelector('.input');

            if (input) {
                if (add)
                    input.classList.add('input-error')
                else
                    input.classList.remove('input-error');
            }
        }
    }

    private setError(form: HTMLFormElement, elementName: string, message: string) {
        let errorElement = form.querySelector(`error-message[name='${elementName}']`) as HTMLErrorMessageElement;

        if (errorElement) {
            this.changeErrorInput(errorElement, true);

            errorElement.message = message;
        }
    }
}

export default new FormValidation();