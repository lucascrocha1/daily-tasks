import { Component, h, Prop, Method, State, Event } from '@stencil/core';
import dailyTaskService from '../daily-task-service';
import { EventEmitter } from '@stencil/router/dist/types/stencil.core';
import { Api } from '../../../../base/interface';

@Component({
    tag: 'daily-task-options',
    styleUrl: 'daily-task-options.scss'
})
export class DailyTaskOptions {
    @State() popoverClosed = true;

    @Prop() task: Api.DailyTask.List.DailyTaskDto;

    @Event() taskUpdatedEvent: EventEmitter;

    popoverElement: HTMLDivElement;

    loaderController: HTMLLoaderComponentElement;

    componentDidLoad() {
        document.onclick = () => {
            if (this.popoverClosed)
                return;

            this.popoverClosed = true;
        }
    }

    @Method()
    async openClose(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.popoverClosed = !this.popoverClosed;

        if (this.popoverClosed)
            return;

        let rect = e.srcElement.getBoundingClientRect();
        this.popoverElement.style.top = (rect.y + rect.height) + 'px';
        // todo: rever esse calculo
        this.popoverElement.style.left = (rect.x - 300) + 'px';
    }

    keepOpen(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    async removeTask(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (confirm('Isso não pode ser desfeito')) {
            await this.loaderController.show();

            await dailyTaskService.delete({ id: this.task.id });
            this.taskUpdatedEvent.emit();
            this.popoverClosed = true;

            await this.loaderController.dismiss();
        }
    }

    async updateTasksToDone(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (confirm('Isso não pode ser desfeito')) {
            await this.loaderController.show();

            await dailyTaskService.setAllTasksDone({ id: this.task.id });
            this.taskUpdatedEvent.emit();
            this.popoverClosed = true;

            await this.loaderController.dismiss();
        }
    }

    editTask() {
        window.location.href = "/edit/" + this.task.id;
    }

    render() {
        return [
            <div onClick={(e) => this.keepOpen(e)}
                ref={e => this.popoverElement = e as any}
                class={`options ${!this.popoverClosed && 'show'}`}>
                <div class="options-item">
                    <span>Compartilhar</span>
                    <img class="svg-item" src="/assets/svg/share.svg"></img>
                </div>
                <div class="options-item">
                    <span>Copiar tarefa para outro dia</span>
                    <img class="svg-item" src="/assets/svg/copy-task.svg"></img>
                </div>
                {
                    this.task && this.task.quantityTasks > this.task.quantityTasksDone &&
                    <div class="options-item" onClick={(e) => this.updateTasksToDone(e)}>
                        <span>Finalizar tarefa</span>
                        <img class="svg-item" src="/assets/svg/check-all.svg"></img>
                    </div>
                }
                <div class="options-item" onClick={(e) => this.removeTask(e)}>
                    <span>Remover</span>
                    <img class="svg-item" src="/assets/svg/delete.svg"></img>
                </div>
            </div>,
            <loader-component ref={e => this.loaderController = e as any}></loader-component>
        ];
    }
}