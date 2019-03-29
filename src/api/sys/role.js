import request from '@/utils/request'
import { stringify } from 'qs'

//查询 分页
export async function fetchObjs (params) {
    return await request({
        method: 'get',
        url: 'upms/sys/role/page',
        params: params
    })
}

//查询 所有
export async function fetchAllObjs () {
    return await request({
        method: 'get',
        url: 'upms/sys/role/all'
    })
}

//根据Id查询
export async function getObj (id) {
    return await request({
        method: 'get',
        url: 'upms/sys/role/' + id,
    })
}

//根据Id删除
export async function deleteObj (id) {
    return await request({
        method: 'delete',
        url: 'upms/sys/role/' + id
    })
}

//添加
export async function addObj (param) {
    return await request({
        method: 'post',
        url: '/upms/sys/role',
        data: stringify(param)//param
    })
}
//更新
export async function putObj (param) {
    return await request({
        method: 'put',
        url: '/upms/sys/role',
        data: stringify(param)
    })
}
//根据用户id查询角色
export async function getRoleByUserId (id) {
    return await request({
        method: 'get',
        url: '/upms/sys/role/user/' + id,
    })
}
