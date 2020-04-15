import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import dayjs from 'dayjs';
import env from '../env/env';

class AxiosConfiguration {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.configure();
    }

    getAxios() {
        return this.axiosInstance;
    }

    private configure() {
        this.configureApiUrl();
        this.configureInterceptor();
        this.configureSerialization();
    }

    configureApiUrl() {
        this.axiosInstance = axios.create({
            baseURL: env.apiUrl
        });
    }

    configureInterceptor() {
        this.axiosInstance.interceptors.response.use(null, (err) => {
            throw err.response;
        });
    }

    configureSerialization() {
        this.axiosInstance.defaults.paramsSerializer = (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat',
                serializeDate: (date: Date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ')
            })
        }
    }
}

export default new AxiosConfiguration();