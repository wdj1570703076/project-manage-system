import axios from 'axios';
import router from '../router';
import Message from 'element-ui/packages/message/src/main';

const service = axios.create({
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
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (error.response.data.code == "UC/TOKEN_INVALID"){
        localStorage.clear();     //删除用户信息
        //如果超时就处理 ，指定要跳转的页面(比如登陆页)
        Message({
            message: error.response.data.msg,
            type: 'warning',
            center: true,
            onClose:function () {
                router.replace({
                    path: '/login',
                })
            }
        });
    }else{
        return Promise.reject(error);
    }
})

export default service;
