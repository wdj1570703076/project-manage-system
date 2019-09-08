import axios from 'axios';
import {message, Modal, notification} from 'ant-design-vue'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

service.interceptors.request.use( config => {
    let token = localStorage.getItem('token');
    if (token) {
        config.headers.common['token'] = token;
    }
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (error.response) {
        let errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
        switch (error.response.status) {
            case 404:
                notification.error({
                    message: '系统提示',
                    description: '很抱歉，资源未找到',
                    duration: 4
                })
                break
            case 403:
            case 401:
                notification.warn({
                    message: '系统提示',
                    description: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
                    duration: 4
                })
                break
            default:
                notification.error({
                    message: '系统提示',
                    description: errorMessage,
                    duration: 4
                })
                break
        }
    }
    return Promise.reject(error);
})

export default service;
