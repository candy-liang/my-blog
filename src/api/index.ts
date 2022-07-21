//service.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const config = {
    baseURL: import.meta.env.VITE_HOST,
    timeout: 10 * 1000,
    withCredentials: true
};

const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    //请求拦截器，自定义
    return config;
};

const service: AxiosInstance = axios.create(config);
service.interceptors.request.use(requestInterceptor, error => Promise.reject(error))
service.interceptors.response.use(res => Promise.resolve(res), error => Promise.reject(error))

export function servicePost<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const promise = service.post<T, AxiosResponse<T>, D>(url, data, config)
    return axiosResponse(promise);
}

/**
 * @param axiosPromise AxiosResponse<T>
 */
function axiosResponse<T>(axiosPromise: Promise<AxiosResponse<T>>): Promise<T> {
    return axiosPromise.then(res => (res.data as any).result).then(err => err);
}
