import axiosConfiguration from '../../base/axios-configuration';

class LoginService {
    axios = axiosConfiguration.getAxios();

    login(body): Promise<string> {
        return this.axios.post('api/Auth/Login', body).then(e => e.data);
    }
}

export default new LoginService();