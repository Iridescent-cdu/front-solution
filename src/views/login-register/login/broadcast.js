// 频道名
const LOGIN_SUCCESS_CHANNEL = 'LOGIN_SUCCESS_CHANNEL'

let broadcastChannel = null
if (window.BroadcastChannel) {
  broadcastChannel = new BroadcastChannel(LOGIN_SUCCESS_CHANNEL)
}
/**
 * 等待回调
 */
const wait = () => {
  return new Promise((resolve) => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        resolve(event.data)
      }
    } else {
      window.onstorage = (event) => {
        if (event.key === LOGIN_SUCCESS_CHANNEL) {
          resolve(JSON.parse(event.newValue))
        }
      }
    }
  })
}
/**
 * 发送消息
 */
const send = (data) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(data)
  } else {
    localStorage.setItem(LOGIN_SUCCESS_CHANNEL, JSON.stringify(data))
  }
}
/**
 * 销毁
 */
const clear = () => {
  if (broadcastChannel) {
    broadcastChannel.close()
    broadcastChannel = null
  } else {
    localStorage.removeItem(LOGIN_SUCCESS_CHANNEL)
  }
}

export default {
  wait,
  send,
  clear,
}
