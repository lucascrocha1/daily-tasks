import { Component, h, State, Listen } from '@stencil/core';
import dailyTaskService from '../daily-task-service';
import { formatDateAsString } from '../../../utils/utils';
import { Api } from '../../../base/interface';

@Component({
    tag: 'daily-task-list',
    styleUrl: 'daily-task-list.scss'
})
export class DailyTaskList {
    @State() state: Api.DailyTask.List.DailyTaskDto[];

    dateFilter: string = formatDateAsString(new Date());

    taskOptionsController: HTMLDailyTaskOptionsElement;

    modalController: HTMLModalComponentElement;

    dailyTaskPage: HTMLDailyTaskInsertEditElement;

    pageIndex: number = 1;

    pageSize: number = 8;

    componentWillLoad() {
        this.loadState();
    }

    @Listen('dayChanged', { target: 'window' })
    async dayChangedHandler(e: CustomEvent) {
        if (e.detail.ignoreDateChange)
            return;

        this.dateFilter = formatDateAsString(e.detail.date);

        await this.loadState();
    }

    @Listen('taskUpdatedEvent')
    async taskUpdatedEventHandler() {
        await this.loadState();
    }

    async loadState() {
        this.state = await dailyTaskService.list({
            date: this.dateFilter,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        });
    }

    async editTask(task: Api.DailyTask.List.DailyTaskDto) {
        // ToDo: rever isso aqui
        this.dailyTaskPage.modalController = this.modalController;
        this.dailyTaskPage.taskId = task.id;
        await this.dailyTaskPage.loadState();

        await this.modalController.present();
    }

    async addTask() {
        // ToDo: rever isso aqui
        this.dailyTaskPage.modalController = this.modalController;
        this.dailyTaskPage.taskId = null;
        await this.dailyTaskPage.loadState();

        await this.modalController.present();
    }

    dragStart(e) {
        let dropzones = document.querySelectorAll('.task-self');
        dropzones.forEach(e => e.classList.add('dropzone-active'));

        e.dataTransfer.setData('text/plain', e.target.id);
    }

    dragOver(e) {
        e.preventDefault();
    }

    async onDrop(e) {
        let id = e.dataTransfer.getData('text');

        let element = document.getElementById(id);
        let dropzone = e.target.closest('.task-self');

        dropzone.appendChild(element);

        e.dataTransfer.clearData();

        let dropzones = document.querySelectorAll('.task-self');

        dropzones.forEach(e => e.classList.remove('dropzone-active'));

        await this.updateState(id, +dropzone.id);
        await this.loadState();
    }

    async updateState(id: number, state: Api.DailyTask.DailyTaskStateEnum) {
        await dailyTaskService.updateState({ id, state });
    }

    openMoreOptions(e, task: Api.DailyTask.List.DailyTaskDto) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.taskOptionsController.task = task;
        this.taskOptionsController.openClose(e);
    }

    getTaskColor(state: Api.DailyTask.DailyTaskStateEnum) {
        switch (state) {
            case Api.DailyTask.DailyTaskStateEnum.New:
                return "task-to-do";
            case Api.DailyTask.DailyTaskStateEnum.Active:
                return "task-active";
            case Api.DailyTask.DailyTaskStateEnum.Closed:
                return "task-closed";
            default:
                return "task-to-do";
        }
    }

    renderState(task: Api.DailyTask.List.DailyTaskDto) {
        return [
            <div id={task.id.toString()}
                title={task.title}
                draggable={true}
                onDragStart={e => this.dragStart(e)}
                class={`task ${this.getTaskColor(task.state)}`}
                onClick={() => this.editTask(task)}>
                <div class="title-background">
                    <div class="task-title">
                        {task.title}
                    </div>
                    <div class="btn-more-background" onClick={(e) => this.openMoreOptions(e, task)}>
                        <img title="More" class="img-more" src="/assets/svg/more.svg"></img>
                    </div>
                </div>
                <div>
                    <span class="task-quantity">
                        {task.quantityTasksDone} / {task.quantityTasks} tarefas feitas
                    </span>
                </div>
            </div>
        ];
    }

    renderFabAddTask() {
        return (
            <div class="fab-task" onClick={() => this.addTask()}>
                <img class="img-add-task" src="/assets/svg/add.svg"></img>
            </div>
        )
    }

    renderModal() {
        return (
            <modal-component ref={e => this.modalController = e as any}>
                <daily-task-insert-edit ref={e => this.dailyTaskPage = e as any}></daily-task-insert-edit>
            </modal-component>
        );
    }

    render() {
        if (!this.state)
            return [
                <center class="center-spinner"><spinner-component></spinner-component></center>,
                this.renderFabAddTask(),
                this.renderModal()
            ]

        if (!this.state.length)
            return [
                <p><center>No records found.</center></p>,
                this.renderFabAddTask(),
                this.renderModal()
            ]

        let toDo = this.state.filter(e => e.state == Api.DailyTask.DailyTaskStateEnum.New);

        let doing = this.state.filter(e => e.state == Api.DailyTask.DailyTaskStateEnum.Active);

        let done = this.state.filter(e => e.state == Api.DailyTask.DailyTaskStateEnum.Closed)

        return [
            <header-component></header-component>,
            <div class="tasks">
                <div class="task-self"
                    id={Api.DailyTask.DailyTaskStateEnum.New.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>To Do</span>
                    </div>
                    {toDo.map(e => this.renderState(e))}
                </div>
                <div class="task-self"
                    id={Api.DailyTask.DailyTaskStateEnum.Active.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>Doing</span>
                    </div>
                    {doing.map(e => this.renderState(e))}
                </div>
                <div class="task-self"
                    id={Api.DailyTask.DailyTaskStateEnum.Closed.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>Done</span>
                    </div>
                    {done.map(e => this.renderState(e))}
                </div>
            </div>,
            this.renderModal(),
            this.renderFabAddTask(),
            <daily-task-options ref={e => this.taskOptionsController = e as any}></daily-task-options>,
        ]
    }
}