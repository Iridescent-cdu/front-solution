import request from '@/utils/mockRequest'

/**
 * 获取图片数据列表
 */
export const getPexlesList = (data) => {
  return request({
    url: '/pexels/list',
    params: data,
    method: 'post',
  })
}
/**
 * 获取搜索提示
 */
export const getHint = (q) => {
  return request({
    url: '/pexels/hint',
    params: {
      q,
    },
    method: 'get',
  })
}
/**
 * 获取推荐主题
 */
export const getThemes = () => {
  return request({
    url: '/pexels/themes',
    method: 'get',
  })
}
/**
 * 获取指定图片数据
 */
export const getPexelsFromId = (id) => {
  return request({
    url: `/pexels/${id}`,
    method: 'get',
  })
}
