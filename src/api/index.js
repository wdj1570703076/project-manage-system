import request from '../utils/request';

//登陆校验
export const loginCheck = (params) => {
    return request({
        url: '/admin/login',
        method: 'post',
        params: params
    })
}

//数据查询
export const fetchData = (params) => {
    return request({
        url: params.address,
        method: 'get',
        params: params
    })
}

//数据添加
export const updateData = (params) => {
    return request({
        url: '/admin/ags',
        method: 'post',
        data: params
    })
}

//数据删除
export const deleteData = (params) => {
    return request({
        url: '/admin/ags',
        method: 'delete',
        params: params
    })
}
