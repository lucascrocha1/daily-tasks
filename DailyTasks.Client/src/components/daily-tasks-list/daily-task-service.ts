import { IDailyTaskList, IDailyTaskInsertEdit, TaskState, TaskItemDto } from '../../base/interface';
import axiosConfiguration from '../../base/axios-configuration';

class DailyTaskService {
    axios = axiosConfiguration.getAxios();

    async list(query: { date: Date, state?: number }): Promise<IDailyTaskList[]> {
        return this.axios.get('api/Task/List', { params: query }).then(e => e.data);
    }

    async get(query: { id: string }): Promise<IDailyTaskInsertEdit> {
        return this.axios.get('api/Task/Get', { params: query }).then(e => e.data);
    }

    async getTasks(query: { id: string }): Promise<TaskItemDto[]> {
        return this.axios.get('api/Task/GetTasks', { params: query }).then(e => e.data);
    }

    async edit(command: IDailyTaskInsertEdit) {
        await this.axios.put('api/Task/Edit', command);
    }

    async insert(command: IDailyTaskInsertEdit) {
        await this.axios.post('api/Task/Insert', command);
    }

    async updateState(command: { id: string, state: TaskState }) {
        await this.axios.post('api/task/UpdateState', command);
    }

    async delete(command: { taskId: string }) {
        return this.axios.post('api/Task/Delete', command);
    }

    async setAllTasksDone(command: { id: string }) {
        await this.axios.post('api/Task/SetAllTasksDone', command);
    }
}

export default new DailyTaskService();