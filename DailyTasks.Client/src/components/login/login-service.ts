import axiosConfiguration from '../../base/axios-configuration';

class LoginService {
    axios = axiosConfiguration.getAxios();

    login(body): Promise<boolean> {
        return this.axios.post('api/Auth/Login', body).then(e => e.data);
    }
}

export default new LoginService();