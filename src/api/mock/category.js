import request from '@/utils/mockRequest.js'

/**
 * 获取分类列表
 */
export const getCategory = () => {
  return request({
    url: '/category',
  })
}

export default getCategory
