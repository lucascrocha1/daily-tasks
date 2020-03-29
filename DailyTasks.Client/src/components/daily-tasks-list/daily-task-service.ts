import { IDailyTaskList, IDailyTaskInsertEdit } from '../../base/interface';
import axiosConfiguration from '../../base/axios-configuration';

class DailyTaskService {
    axios = axiosConfiguration.getAxios();

    async list(query: { date: Date, state?: number }) : Promise<IDailyTaskList[]> {
        return this.axios.get('api/Task/List', { params: query }).then(e => e.data);
    }

    async get(query: { id: string }) : Promise<IDailyTaskInsertEdit> {
        return this.axios.get('api/Task/Get', { params: query }).then(e => e.data);
    }

    async edit(command: IDailyTaskList) {
        return this.axios.put('api/Task/Edit', command);
    }

    async insert(command: IDailyTaskList) {
        return this.axios.post('api/Task/Insert', command);
    }

    async delete(command: { taskId: string }) {
        return this.axios.post('api/Task/Delete', command);
    }
}

export default new DailyTaskService();