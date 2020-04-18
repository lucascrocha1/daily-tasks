import axiosConfiguration from '../../base/axios-configuration';
import { Api } from '../../base/interface';

class DailyTaskService {
    axios = axiosConfiguration.getAxios();

    async list(query: Api.DailyTask.List.Query): Promise<Api.DailyTask.List.DailyTaskDto[]> {
        return this.axios.get('api/Task/List', { params: query }).then(e => e.data);
    }

    async get(query: Api.DailyTask.Get.Query): Promise<Api.DailyTask.Get.Dto> {
        return this.axios.get('api/Task/Get', { params: query }).then(e => e.data);
    }

    async edit(command: Api.DailyTask.InsertEdit.Command) {
        await this.axios.put('api/Task/Edit', command);
    }

    async insert(command: Api.DailyTask.InsertEdit.Command) {
        await this.axios.post('api/Task/Insert', command);
    }

    async updateState(command: Api.DailyTask.UpdateState.Command) {
        await this.axios.post('api/task/UpdateState', command);
    }

    async delete(command: Api.DailyTask.Delete.Command) {
        return this.axios.post('api/Task/Delete', command);
    }

    async setAllTasksDone(command: Api.DailyTask.SetAllTasksDone.Command) {
        await this.axios.post('api/Task/SetAllTasksDone', command);
    }
}

export default new DailyTaskService();