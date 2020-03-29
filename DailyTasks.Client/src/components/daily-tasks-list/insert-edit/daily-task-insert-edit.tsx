import { Component, h, Prop, State } from '@stencil/core';
import { IDailyTaskInsertEdit, TaskState } from '../../../base/interface';
import dailyTaskService from '../daily-task-service';
import { MatchResults } from '@stencil/router';

@Component({
    tag: 'daily-task-insert-edit'
})
export class DailyTaskInsertEdit {
    @State() state: IDailyTaskInsertEdit;

    @Prop() match: MatchResults;

    componentWillLoad() {
        this.loadState();
    }

    async loadState() {
        let taskId = this.match.params.taskId;

        if (taskId)
            this.state = await dailyTaskService.get({ id: taskId });
        else
            this.state = {
                date: new Date(),
                description: null,
                id: null,
                state: TaskState.New,
                taskItems: []
            }
    }

    render() {
        return (
            <div>
                <label>Description</label>
                <input type="text"></input>
            </div>
        )
    }
}