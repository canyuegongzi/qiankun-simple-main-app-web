import axios from 'axios';
import { message, Button, Space } from 'antd';
// @ts-ignore
import qs from 'query-string';
import {MimeStorage} from "../scripts/localStorage";

// 设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
};
// 请求超时的时间限制
axios.defaults.timeout = 20000;
// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
let requestName;
axios.interceptors.request.use((config) => {
    const mimeStorage = new MimeStorage();
    let sessionStorageToken = mimeStorage.getItem('token') || sessionStorage.getItem('token');
    config.headers.token = sessionStorageToken;
    if (process.env.NODE_ENV !== 'production') {
        config.headers.ignoreToken = 'true';
    }
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
    if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(window.APPROOTENV.casDomain) ?
    window.APPROOTENV.casDomain :
    window.APPROOTENV.domain + window.APPROOTENV.casDomain;
// 请求到结果的拦截处理
axios.interceptors.response.use((config) => {
    if (config.data && config.data.code && config.data.code == 30000) {
        const url = window.location.origin + window.location.pathname;
        // @ts-ignore
        window.location.href = casBaseURL + '?redirectUrl=' + url;
    }
    return config.data;
}, (error) => {
    return Promise.reject(error);
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
});
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
export const $post = async (url, params, server = 'user') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params)).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export const $get = (url, params, server = 'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then((res) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err) => {
            reject(err);
        });
    });
};
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export const $getFile = (url, params, server = 'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.get(url, { params, responseType: 'arraybuffer', }).then((res) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err) => {
            reject(err);
        });
    });
};

function getBaseUrl(name) {
    switch (name) {
        case 'user':
            return window.APPROOTENV.userCenterServer;
        default:
            return window.APPROOTENV.userCenterServer;
    }
}
