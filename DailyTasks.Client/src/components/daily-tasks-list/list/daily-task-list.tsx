import { Component, h, State, Listen } from '@stencil/core';
import { IDailyTaskList, TaskState, TaskItemDto } from '../../../base/interface';
import dailyTaskService from '../daily-task-service';
import { formatDateString } from '../../../utils/utils';

@Component({
    tag: 'daily-task-list',
    styleUrl: 'daily-task-list.scss'
})
export class DailyTaskList {
    @State() state: IDailyTaskList[];

    dateFilter: Date = new Date();

    taskOptionsController: HTMLDailyTaskOptionsElement;

    componentWillLoad() {
        this.loadState();
    }

    @Listen('dayChanged', { target: 'window' })
    async dayChangedHandler(e: CustomEvent) {
        this.dateFilter = e.detail;

        await this.loadState();
    }

    @Listen('taskRemoved')
    async taskRemovedHandler() {
        await this.loadState();
    }

    async loadState() {
        this.state = null;
        
        this.state = await dailyTaskService.list({ date: this.dateFilter, state: null });
    }

    editTask(task: IDailyTaskList) {
        window.location.href = `/edit/${task.id}`;
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

    async updateState(id: string, state: TaskState) {
        await dailyTaskService.updateState({ id, state });
    }

    openMoreOptions(e, task: IDailyTaskList) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.taskOptionsController.task = task;
        this.taskOptionsController.openClose(e);
    }

    async expandTasks(e, taskItemId: string, taskImageId: string) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        let element = document.getElementById(taskItemId) as HTMLDivElement;
        element.hidden = !element.hidden;

        let img = document.getElementById(taskImageId) as HTMLImageElement;

        if (element.hidden)
            img.src = img.src.replace('up', 'down');
        else
            img.src = img.src.replace('down', 'up');
    }

    getTaskColor(state: TaskState) {
        switch (state) {
            case TaskState.New:
                return "task-to-do";
            case TaskState.Active:
                return "task-active";
            case TaskState.Closed:
                return "task-closed";
            default:
                return "task-to-do";
        }
    }

    getBorderColor(state: TaskState) {
        switch (state) {
            case TaskState.New:
                return "border-to-do";
            case TaskState.Active:
                return "border-active";
            case TaskState.Closed:
                return "border-closed";
            default:
                return "border-to-do";
        }
    }

    renderImageDownOption(taskImageId: string, state: TaskState) {
        switch (state) {
            case TaskState.New:
                return <img id={taskImageId} class="img-down-arrow" src="/assets/svg/btn-down-grey.svg"></img>
            case TaskState.Active:
                return <img id={taskImageId} class="img-down-arrow" src="/assets/svg/btn-down-yellow.svg"></img>
            case TaskState.Closed:
                return <img id={taskImageId} class="img-down-arrow" src="/assets/svg/btn-down-green.svg"></img>
            default:
                return <img id={taskImageId} class="img-down-arrow" src="/assets/svg/btn-down-grey.svg"></img>
        }
    }

    getImageUpOption(state: TaskState) {
        switch (state) {
            case TaskState.New:
                return "/assets/svg/btn-down-grey.svg"
            case TaskState.Active:
                return "/assets/svg/btn-down-yellow.svg"
            case TaskState.Closed:
                return "/assets/svg/btn-down-green.svg"
            default:
                return "/assets/svg/btn-down-grey.svg"
        }
    }

    renderTaskItems(task: TaskItemDto, state: TaskState) {
        return (
            <div class={`task-item-inner ${this.getBorderColor(state)}`}>
                <span>{task.description}</span>
                {task.done && <img class="check-task-done" src="/assets/svg/check.svg"></img>}
            </div>
        )
    }

    renderState(task: IDailyTaskList) {
        let taskItemId = `task-item-${task.id}`;
        let taskImageId = `task-image-${task.id}`;

        return [
            <div id={task.id}
                title={task.description}
                draggable={true}
                onDragStart={e => this.dragStart(e)}
                class={`task ${this.getTaskColor(task.state)}`}
                onClick={() => this.editTask(task)}>
                <div class="title-background">
                    <div class="task-title">
                        {task.description}
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
                <div class="task-createt-at">
                    <span>
                        Criado em {formatDateString(task.createdAt)}
                    </span>
                </div>
                <div title="Options" class="btn-down-arrow" onClick={e => this.expandTasks(e, taskItemId, taskImageId)}>
                    {this.renderImageDownOption(taskImageId, task.state)}
                </div>
            </div>,
            <div id={taskItemId} hidden class="task-items-background">
                {task.taskItems.map(e => this.renderTaskItems(e, task.state))}
            </div>
        ];
    }

    renderFabAddTask() {
        return (
            <a class="fab-task" href="/insert">
                <img class="img-add-task" src="/assets/svg/add.svg"></img>
            </a>
        )
    }

    render() {
        if (!this.state || this.state.length == 0)
            return [
                <p><center>No records found.</center></p>,
                this.renderFabAddTask()
            ]

        let toDo = this.state.filter(e => e.state == TaskState.New);

        let doing = this.state.filter(e => e.state == TaskState.Active);

        let done = this.state.filter(e => e.state == TaskState.Closed)

        return [
            <div class="tasks">
                <div class="task-self"
                    id={TaskState.New.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>To Do</span>
                    </div>
                    {toDo.map(e => this.renderState(e))}
                </div>
                <div class="task-self"
                    id={TaskState.Active.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>Doing</span>
                    </div>
                    {doing.map(e => this.renderState(e))}
                </div>
                <div class="task-self"
                    id={TaskState.Closed.toString()}
                    onDrop={e => this.onDrop(e)}
                    onDragOver={e => this.dragOver(e)}>
                    <div>
                        <span>Done</span>
                    </div>
                    {done.map(e => this.renderState(e))}
                </div>
            </div>,
            this.renderFabAddTask(),
            <daily-task-options ref={e => this.taskOptionsController = e as any}></daily-task-options>,
        ]
    }
}