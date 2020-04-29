import { Api } from '../../../base/interface';
import axiosConfiguration from '../../../base/axios-configuration';

class CategoryService {
    axios = axiosConfiguration.getAxios();

    list(query: Api.Category.List.Query): Promise<Api.Category.List.Dto[]> {
        return this.axios.get('api/Category/List', { params: query });
    }
}

export default new CategoryService();