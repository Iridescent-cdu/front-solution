<script setup>
import broadcast from './broadcast'
import { oauthLogin } from './oauth'
import { getWXLoginData, getWXLoginToken, getWXLoginUserInfo } from '@/api/mock/sys'
import { LOGIN_TYPE_WX } from '@/constants'

/**
 * 微信登录成功之后，数据解析
 */
if (window.location.search) {
  const code = /code=((.*))&state/.exec(window.location.search)[1]
  if (code) {
    broadcast.send({
      code,
    })
    // 窗口关闭
    window.close()
  }
}
/**
 * 触发微信登录
 */
const onWeiXinLogin = async () => {
  // 1.获取微信前置登录数据
  const { appId, appSecret, redirectUri, scope, state } = await getWXLoginData()

  // 2.open url
  window.open(
    `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`,
    '',
    'left=270,top=200,height=525,width=585,tollbar=no,menubar=no,scrollbars=no,status=no,location=yes,resizable=yes',
  )
  // 3.等待扫码成功
  broadcast.wait().then(async ({ code }) => {
    //  关闭通知
    broadcast.clear()
    //  获取token
    const { access_token, openid } = await getWXLoginToken(appId, appSecret, code)
    // 获取用户信息
    const { nickname, hedaimgurl } = await getWXLoginUserInfo(access_token, openid)

    oauthLogin(LOGIN_TYPE_WX, {
      openid,
      nickname,
      hedaimgurl,
    })
  })
}
</script>

<template>
  <div @click="onWeiXinLogin">
    <m-svg-icon
      class="w-4 cursor-pointer"
      name="wexin"></m-svg-icon>
    <div id="login_container"></div>
  </div>
</template>

<style scoped lang="scss"></style>
