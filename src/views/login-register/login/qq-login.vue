<script>
import { onMounted } from 'vue'
import broadcast from './broadcast'
import { oauthLogin } from './oauth'
import { LOGIN_TYPE_QQ } from '@/constants'
const QQ_LOGIN_URL =
  'https://graph.qq.com/oauth2.0/authorize?client_id=101998494&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fimooc-front.lgdsunday.club%2Flogin'
</script>

<script setup>
// 点击进行QQ登录，同样可以打开登录视窗，可以传入登录之后的回调
onMounted(() => {
  QC.Login(
    {
      btnId: 'qqLoginBtn',
    },
    // 点击确认登录即登录成功之后的回调，会在登录之后重定向的页面中执行
    // QQ登录存在缓存，登录成功一次之后，下次进入页面会自动重新登录
    (data, opts) => {
      // 注销登录，防止下一次打开页面直接展示上一次的用户信息
      QC.Login.signOut()
      // 拿到QQ用户的唯一标识，通过这个标识来判断当前用户是否已经注册了
      const accessToken = /access_token=((.*))&expires_in/.exec(window.location.hash)[1]
      // 拼接获取到的数据对象
      const oauthObj = {
        nickname: data.nickname,
        headimgurl: data.figureurl_qq_2,
        accessToken,
      }
      broadcast.send(oauthObj)

      // 移动端下没有窗口的概念，我们不用跨页面数据传输，可以直接传递数据
      oauthLogin(LOGIN_TYPE_QQ, oauthObj)
      // 在pc端下，关闭第三方窗口
      window.close()
    },
  )
})
/**
 * 登录按钮事件
 */
const onQQLogin = () => {
  openQQWindow()
}

/**
 * 通过window.open处理QQ登录视窗
 */
const openQQWindow = () => {
  /**
   * 1.打开的url
   * 2.打开方式或窗口的名称
   * 3.打开的窗口的属性
   * 4.是否进入浏览器堆栈管理
   */
  window.open(
    QQ_LOGIN_URL,
    '',
    'left=270,top=200,height=525,width=585,tollbar=no,menubar=no,scrollbars=no,status=no,location=yes,resizable=yes',
  )
  // 发起异步任务，监听其他页面的数据发送
  broadcast.wait().then(async (oauthObj) => {
    broadcast.clear()
    await oauthLogin(LOGIN_TYPE_QQ, oauthObj)
  })
}
</script>

<template>
  <div>
    <span
      v-show="false"
      id="qqLoginBtn"></span>
    <m-svg-icon
      class="w-4 cursor-pointer"
      name="qq"
      @click="onQQLogin"></m-svg-icon>
  </div>
</template>

<style scoped lang="scss"></style>
