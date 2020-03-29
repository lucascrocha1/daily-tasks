import { Component, h, State, Listen } from '@stencil/core';
import { IDailyTaskList, TaskState } from '../../../base/interface';
import dailyTaskService from '../daily-task-service';
import { formatDateString } from '../../../utils/utils';

@Component({
    tag: 'daily-task-list',
    styleUrl: 'daily-task-list.scss'
})
export class DailyTaskList {
    @State() state: IDailyTaskList[];

    dateFilter: Date = new Date();

    componentWillLoad() {
        this.loadState();
    }

    @Listen('window:dayChanged') 
    async dayChangedHandler(e: CustomEvent) {
        this.dateFilter = e.detail;

        await this.loadState();
    }

    async loadState() {
        this.state = await dailyTaskService.list({ date: this.dateFilter, state: null });
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

    renderState(task: IDailyTaskList) {
        return (
            <div class={`task ${this.getTaskColor(task.state)}`}>
                <div>
                    <div class="task-title">{task.description}</div>
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
            </div>
        );
    }

    render() {
        if (!this.state || this.state.length == 0)
            return <p><center>No records found.</center></p>

        let toDo = this.state.filter(e => e.state == TaskState.New);

        let doing = this.state.filter(e => e.state == TaskState.Active);

        let done = this.state.filter(e => e.state == TaskState.Closed)

        return [
            <div class="tasks">
                <div>
                    <span>To Do</span>
                    {toDo.map(e => this.renderState(e))}
                </div>
                <div>
                    <span>Doing</span>
                    {doing.map(e => this.renderState(e))}
                </div>
                <div>
                    <span>Done</span>
                    {done.map(e => this.renderState(e))}
                </div>
            </div>
        ]
    }
}