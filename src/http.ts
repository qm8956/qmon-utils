import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * @description 请求结果枚举
 */
enum ResultEnum {
  SUCCESS = 200,
  OVERDUE = 599,
  TIMEOUT = 10000,
}

/**
 * @description 请求结果数据类型
 */
interface ResultData<T = any> {
  code: number;
  msg: string;
  data: T;
}


interface UserConfig {
  showFullScreenLoading: () => void;
  hideFullScreenLoading: () => void;
  getToken: () => string;
  getLoginUrl: () => string;
  checkStatus: (status: number) => void;
}

/**
 * @class RequestHttp
 * @description 封装的HTTP请求类，包含GET、POST、PUT、DELETE、PATCH方法，并处理请求和响应拦截器。
 * @example
 * const userConfig: UserConfig = {
 *   showFullScreenLoading: () => { console.log('显示全屏加载'); },
 *   hideFullScreenLoading: () => { console.log('隐藏全屏加载'); },
 *   getToken: () => 'your-token',
 *   getLoginUrl: () => 'your-login-url',
 *   checkStatus: (status: number) => { console.log(`HTTP状态码: ${status}`); },
 * };
 * 
 * const config: AxiosRequestConfig = {
 *   baseURL: 'https://api.example.com',
 *   timeout: 10000,
 * };
 * 
 * const api = new RequestHttp(config, userConfig);
 * 
 * // GET 请求示例
 * api.get('/example', { id: 1 }).then(response => {
 *   console.log(response);
 * }).catch(error => {
 *   console.error(error);
 * });
 * 
 * // POST 请求示例
 * api.post('/example', { name: 'test' }).then(response => {
 *   console.log(response);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
class RequestHttp {
  service: AxiosInstance;
  userConfig: UserConfig;

  constructor(config: AxiosRequestConfig, userConfig: UserConfig) {
    this.service = axios.create(config);
    this.userConfig = userConfig;

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers?.noLoading || this.userConfig.showFullScreenLoading();
        config.headers.set('Satoken', this.userConfig.getToken());
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        this.userConfig.hideFullScreenLoading();
        if ('promptMsg' in data) return data;
        if (data.code == ResultEnum.OVERDUE) {
          window.location.href = this.userConfig.getLoginUrl();
          return Promise.reject(new Error(data.message || 'Unknown error'));
        }
        if ((data.code && data.code !== ResultEnum.SUCCESS) || !data.code) {
          return Promise.reject(new Error(data.message || 'Unknown error'));
        }
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        if (response?.status == ResultEnum.OVERDUE) {
          window.location.href = this.userConfig.getLoginUrl();
        }
        this.userConfig.hideFullScreenLoading();
        if (error.message.indexOf('timeout') !== -1) {
          console.error('请求超时！请您稍后重试');
        }
        if (response) this.userConfig.checkStatus(response.status);
        if (!window.navigator.onLine) {
          console.error('网络断开');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description GET请求
   * @param {string} url 请求的URL
   * @param {object} [params] 请求参数
   * @param {object} [_object] 其他配置
   * @returns {Promise<ResultData<T>>} 请求结果
   */
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object });
  }

  /**
   * @description POST请求
   * @param {string} url 请求的URL
   * @param {object} [params] 请求参数
   * @param {object} [_object] 其他配置
   * @returns {Promise<ResultData<T>>} 请求结果
   */
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object);
  }

  /**
   * @description PUT请求
   * @param {string} url 请求的URL
   * @param {object} [params] 请求参数
   * @param {object} [_object] 其他配置
   * @returns {Promise<ResultData<T>>} 请求结果
   */
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }

  /**
   * @description DELETE请求
   * @param {string} url 请求的URL
   * @param {any} [params] 请求参数
   * @param {object} [_object] 其他配置
   * @returns {Promise<ResultData<T>>} 请求结果
   */
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }

  /**
   * @description PATCH请求
   * @param {string} url 请求的URL
   * @param {any} [params] 请求参数
   * @param {object} [_object] 其他配置
   * @returns {Promise<ResultData<T>>} 请求结果
   */
  patch<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.patch(url, params, _object);
  }
}

export default (config: AxiosRequestConfig, userConfig: UserConfig) => new RequestHttp(config, userConfig);