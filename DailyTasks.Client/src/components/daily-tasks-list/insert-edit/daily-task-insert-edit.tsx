import { Component, h, Prop, State, Listen } from '@stencil/core';
import { IDailyTaskInsertEdit, TaskState, TaskItemDto } from '../../../base/interface';
import dailyTaskService from '../daily-task-service';
import { MatchResults } from '@stencil/router';
import dayjs from 'dayjs';

@Component({
    tag: 'daily-task-insert-edit',
    styleUrl: 'daily-task-insert-edit.scss'
})
export class DailyTaskInsertEdit {
    @State() state: IDailyTaskInsertEdit;

    @Prop() match: MatchResults;

    selectElement: HTMLSelectElement;

    loaderController: HTMLLoaderComponentElement;

    componentWillLoad() {
        this.loadState();
    }

    componentDidLoad() {
        this.hideCalendar();
    }

    componentDidRender() {
        this.setStateValue();
    }

    @Listen('window:dayChanged')
    async dayChangedHandler(e: CustomEvent) {
        this.state.date = e.detail;
    }

    hideCalendar() {
        let header = document.querySelector('header-component');

        header.hideCalendar = true;
        header.showBackButton = true;
    }

    setStateValue() {
        if (this.state && this.selectElement)
            this.selectElement.value = this.state.state as any;
    }

    async loadState() {
        let taskId = this.match.params.taskId;

        if (taskId) {
            this.state = await dailyTaskService.get({ id: taskId });
            this.ensureOneDescriptionIsNull();
        }
        else
            this.state = {
                date: new Date(),
                description: null,
                id: null,
                state: TaskState.New,
                taskItems: [{
                    description: null,
                    done: false,
                    id: null
                }]
            }
    }

    handleDescriptionChange(e) {
        let value = e.target.value;

        this.state.description = value;
    }

    ensureOneDescriptionIsNull() {
        let lastTask = this.state.taskItems.slice(-1).pop();

        if (lastTask && !!lastTask.description) {
            this.state.taskItems.push({
                id: null,
                description: null,
                done: false
            })

            this.state = {
                ...this.state
            }
        }
    }

    handleTaskChange(e, taskItem: TaskItemDto) {
        let value = e.target.value;

        taskItem.description = value;

        this.ensureOneDescriptionIsNull();
    }

    handleSelectChange(e) {
        this.state.state = +e.target.value;
    }

    removeTaskItem(e, taskItem: TaskItemDto) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.state.taskItems = this.state.taskItems.filter(e => e != taskItem);

        this.state = {
            ...this.state
        }
    }

    renderTaskItem(taskItem: TaskItemDto) {
        return [
            <div class="task-item form-group">
                <div class="btn-delete-background">
                    <button class="btn-delete-task" onClick={(e) => this.removeTaskItem(e, taskItem)}>
                        <img class="img-delete-task" src="/assets/svg/delete.svg"></img>
                    </button>
                </div>
                <div>
                    <input
                        placeholder="Description"
                        value={taskItem.description}
                        class="input"
                        onInput={(e => this.handleTaskChange(e, taskItem))}
                        type="text">
                    </input>
                </div>
                <div class="done-background">
                    <label class="done-label">Done</label>
                    <br></br>
                    <input class="input-checkbox" type="checkbox" checked={taskItem.done}></input>
                </div>
            </div>
        ]
    }

    async submit(e) {
        this.loaderController.show();

        e.preventDefault();

        let taskId = this.match.params.taskId;

        this.state.date = dayjs(this.state.date).format('YYYY-MM-DDTHH:mm:ssZ')

        if (taskId)
            await dailyTaskService.edit(this.state);
        else
            await dailyTaskService.insert(this.state);

        location.href = "/";

        this.loaderController.dismiss();
    }

    render() {
        if (!this.state)
            return <center><spinner-component></spinner-component></center>

        return [
            <div class="daily-task-page">
                <form onSubmit={(e) => this.submit(e)}>
                    <div class="daily-task-form">
                        <div>
                            <div class="form-group">
                                <label>Description</label>
                                <input required value={this.state.description} placeholder="Description" onChange={(e) => this.handleDescriptionChange(e)} class="input" type="text"></input>
                            </div>
                            <div class="form-group">
                                <label>State</label>
                                <select
                                    ref={e => this.selectElement = e as any}
                                    required
                                    onChange={(e) => this.handleSelectChange(e)}
                                    class="input">
                                    <option value={TaskState.New as any}>To do</option>
                                    <option value={TaskState.Active as any}>Doing</option>
                                    <option value={TaskState.Closed as any}>Done</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <div class="task-title-background">
                                    <span>Tasks</span>
                                </div>
                                <div>
                                    {this.state.taskItems.map(e => this.renderTaskItem(e))}
                                </div>
                            </div>
                        </div>
                        <div class="calendar-component">
                            <calendar-component></calendar-component>
                        </div>
                    </div>
                    <div class="btn-background">
                        <button type="submit" class="btn-confirm">Confirm</button>
                    </div>
                </form>
            </div>,
            <loader-component ref={e => this.loaderController = e as any}></loader-component>
        ]
    }
}