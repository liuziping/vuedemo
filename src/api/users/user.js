import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/user/',
    method: 'get',
    params
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/user/',
    method: 'post',
    data
  })
}

// 修改用户信息
export function updateUser(id, data) {
  return request({
    url: '/user/' + id + '/',
    method: 'put',
    data
  })
}

// 修改用户状态
export function updateUserStatus(id, data) {
  return request({
    url: '/user/' + id + '/',
    method: 'patch',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/user/' + id + '/',
    method: 'delete'
  })
}

// 将用户加入组中
export function updateUserGroup(id, data) {
  return request({
    url: '/usergroup/' + id + '/',
    method: 'put',
    data
  })
}
