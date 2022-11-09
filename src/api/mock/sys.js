import request from '@/utils/mockRequest'

/**
 * 人类行为验证
 */
export const getCaptcha = (data) => {
  return request({
    url: '/sys/captcha',
    method: 'POST',
    data,
  })
}
/**
 * 登录
 */
export const loginUser = (data) => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data,
  })
}
/**
 * 获取用户信息
 */
export const getUserDetail = (data) => {
  return request({
    url: '/user/profile',
    method: 'GET',
    data,
  })
}
/**
 * 修改用户信息
 */
export const putProfile = (data) => {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data,
  })
}

/**
 * 注册
 */
export const registerUser = (data) => {
  return request({
    url: '/sys/register',
    method: 'POST',
    data,
  })
}
/**
 * 获取OSS上传凭证
 */
export const getSts = () => {
  return request({
    url: '/user/sts',
  })
}
/**
 * 微信登录前置数据获取
 */
export const getWXLoginData = () => {
  return request({
    url: '/sys/wxlogin/data',
  })
}
/**
 * 微信登录获取access_token
 */
export const getWXLoginToken = (appid, secret, code) => {
  return request({
    url: '/sys/wxlogin/access_token',
    params: {
      appid,
      secret,
      code,
    },
  })
}
/**
 * 微信登录获取用户信息
 */
export const getWXLoginUserInfo = (access_token, openid) => {
  return request({
    url: '/sys/wxlogin/userinfo',
    params: {
      access_token,
      openid,
    },
  })
}
