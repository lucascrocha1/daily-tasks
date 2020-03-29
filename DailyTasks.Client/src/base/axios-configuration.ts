import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

class AxiosConfiguration {
    private axiosInstance: AxiosInstance;
    private apiUrl: string = 'https://localhost:44319/';

    constructor() {
        this.configure();
    }

    getAxios() {
        return this.axiosInstance;
    }

    private configure() {
        this.configureApiUrl();
    }

    configureApiUrl() {
        this.axiosInstance = axios.create({
            baseURL: this.apiUrl
        });
    }

    configureInterceptor() {
        this.axiosInstance.interceptors.response.use(null, (err) => {
            throw err.response;
        });
    }

    configureSerialization() {
        this.axiosInstance.defaults.paramsSerializer = (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
}

export default new AxiosConfiguration();