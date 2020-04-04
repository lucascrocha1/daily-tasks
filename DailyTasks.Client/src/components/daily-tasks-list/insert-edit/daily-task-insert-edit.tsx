import { Component, h, Prop, State, Listen, Method } from '@stencil/core';
import dailyTaskService from '../daily-task-service';
import { Api } from '../../../base/interface';
import { formatDateAsString } from '../../../utils/utils';

@Component({
    tag: 'daily-task-insert-edit',
    styleUrl: 'daily-task-insert-edit.scss'
})
export class DailyTaskInsertEdit {
    @State() state: Api.DailyTask.InsertEdit.Command;

    @State() selectedDate: Date;

    @Prop() taskId: number;

    @Prop() modalController: HTMLModalComponentElement;

    selectElement: HTMLSelectElement;

    loaderController: HTMLLoaderComponentElement;

    componentWillLoad() {
        this.loadState();
    }

    componentDidRender() {
        this.setStateValue();
    }

    @Listen('dayChanged', { target: 'window' })
    async dayChangedHandler(e: CustomEvent) {
        this.state.date = formatDateAsString(e.detail.date);
    }

    setStateValue() {
        if (this.state && this.selectElement)
            this.selectElement.value = this.state.state as any;
    }

    @Method()
    async loadState() {
        if (this.taskId) {
            this.state = await dailyTaskService.get({ id: this.taskId });
            this.ensureOneDescriptionIsNull();

            this.selectedDate = new Date(this.state.date);
        }
        else {
            this.state = {
                date: formatDateAsString(new Date()),
                title: null,
                description: null,
                id: null,
                state: Api.DailyTask.DailyTaskStateEnum.New,
                checklists: [{
                    description: null,
                    done: false,
                    id: null
                }]
            }
        }
    }

    handleDescriptionChange(e) {
        let value = e.target.value;

        this.state.description = value;
    }

    handleTitleChange(e) {
        let value = e.target.value;

        this.state.title = value;
    }

    ensureOneDescriptionIsNull() {
        let lastTask = this.state.checklists.slice(-1).pop();

        if (lastTask && !!lastTask.description)
            this.addNewTask()
    }

    addNewTask() {
        this.state.checklists.push({
            id: null,
            description: null,
            done: false
        })

        this.state = {
            ...this.state
        }
    }

    handleTaskChange(e, checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        let value = e.target.value;

        checklist.description = value;

        this.ensureOneDescriptionIsNull();
    }

    handleSelectChange(e) {
        this.state.state = +e.target.value;
    }

    removeTaskItem(e, checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.state.checklists = this.state.checklists.filter(e => e != checklist);

        this.state = {
            ...this.state
        }

        this.ensureOneDescriptionIsNull();
    }

    async submit(e) {
        this.loaderController.show();

        e.preventDefault();

        if (this.taskId)
            await dailyTaskService.edit(this.state);
        else
            await dailyTaskService.insert(this.state);

        location.href = "/";

        this.loaderController.dismiss();
    }

    async closeModal() {
        await this.modalController.dismiss();
    }   

    renderChecklist(checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        return [
            <div class="task-item form-group">
                <div class="btn-delete-background">
                    <button class="btn-delete-task" onClick={(e) => this.removeTaskItem(e, checklist)}>
                        <img class="img-delete-task" src="/assets/svg/delete.svg"></img>
                    </button>
                </div>
                <div>
                    <input
                        placeholder="Description"
                        value={checklist.description}
                        class="input"
                        onInput={(e => this.handleTaskChange(e, checklist))}
                        type="text">
                    </input>
                </div>
                <div class="done-background">
                    <label class="done-label">Done</label>
                    <br></br>
                    <input class="input-checkbox" type="checkbox" checked={checklist.done}></input>
                </div>
            </div>
        ]
    }

    render() {
        if (!this.state)
            return <center><spinner-component></spinner-component></center>

        return [
            <div>
                <div class="task-header">
                    <div class="img-cancel-background" onClick={() => this.closeModal()}>
                        <img class="img-cancel" src="/assets/svg/cancel.svg"></img>
                    </div>
                    <span class="task-header-title">
                        {this.taskId ? 'Edit' : 'Insert'} task
                </span>
                </div>
                <div class="daily-task-page">
                    <form onSubmit={(e) => this.submit(e)}>
                        <div class="daily-task-form">
                            <div>
                                <div class="form-group">
                                    <label>Title</label>
                                    <input
                                        required
                                        value={this.state.title}
                                        onChange={(e) => this.handleTitleChange(e)}
                                        class="input"
                                        type="text">
                                    </input>
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        value={this.state.description}
                                        placeholder="Description"
                                        maxlength={1000}
                                        onChange={(e) => this.handleDescriptionChange(e)}
                                        class="input textarea">
                                    </textarea>
                                    <div></div>
                                </div>
                                <div class="form-group">
                                    <label>State</label>
                                    <select
                                        ref={e => this.selectElement = e as any}
                                        required
                                        onChange={(e) => this.handleSelectChange(e)}
                                        class="input">
                                        <option value={Api.DailyTask.DailyTaskStateEnum.New as any}>To do</option>
                                        <option value={Api.DailyTask.DailyTaskStateEnum.Active as any}>Doing</option>
                                        <option value={Api.DailyTask.DailyTaskStateEnum.Closed as any}>Done</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <div class="task-title-background">
                                        <span>Tasks</span>
                                    </div>
                                    <div>
                                        {this.state.checklists.map(e => this.renderChecklist(e))}
                                    </div>
                                </div>
                            </div>
                            <div class="calendar-component">
                                <calendar-component currentSelectedDate={this.selectedDate}></calendar-component>
                            </div>
                        </div>
                        <div class="btn-background">
                            <button type="submit" class="btn-confirm">Confirm</button>
                        </div>
                    </form>
                </div>
            </div>,
            <loader-component ref={e => this.loaderController = e as any}></loader-component>
        ]
    }
}