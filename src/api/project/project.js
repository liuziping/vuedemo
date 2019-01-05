import request from '@/utils/request'

// 获取当前用户任务列表
export function getProjectList() {
  return request({
    url: '/projects/list/',
    method: 'get'
  })
}

// 获取当前项目tag列表
export function getProjectTag(params) {
  return request({
    url: '/projects/tag/',
    method: 'get',
    params
  })
}
