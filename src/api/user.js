import request from '@/utils/request'
// 查询 分页
export async function fetchObjs(params) {
  return await request({
    method: 'get',
    url: 'upms/sys/user/page',
    params: params
  })
}

// 根据Id删除
export const deleteObj = async(id) => {
  return await request({
    method: 'delete',
    url: 'upms/sys/user/' + id
  })
}
