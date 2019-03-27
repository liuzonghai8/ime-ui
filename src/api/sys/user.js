import request from '@/utils/request'
// 查询 分页
export const fetchObjs = async (params) => {
  return await request({
    method: 'get',
    url: 'upms/sys/user/page',
    params: params
  })
}

// 根据Id删除
export const deleteObj = async (id) => {
  return await request({
    method: 'delete',
    url: 'upms/sys/user/' + id
  })
}
//根据Id查询  箭头函数写法
export const getObj = async (id) => {
  return await request({
    method: 'get',
    url: 'upms/sys/user/' + id,
  })
}
// //根据Id删除
// export async function deleteObj (id) {
//   return await request({
//     method: 'delete',
//     url: 'upms/sys/user/' + id
//   })
// }

//添加
export const addObj = async (param) => {
  return await request({
    method: 'post',
    url: '/upms/sys/user',
    data: stringify(param)//param
  })
}
//更新
export const putObj = async (param) => {
  return await request({
    method: 'put',
    url: '/upms/sys/user',
    data: stringify(param)
  })
}