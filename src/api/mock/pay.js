import request from '@/utils/mockRequest.js'

/**
 * 获取VIP支付数据
 */
export const getVipPayList = () => {
  return request({
    url: '/user/vip/pay/list',
  })
}
/**
 * 支付宝下单
 */
export const getAliPay = (subject, totalAmount, body, isMobile) => {
  return request({
    url: '/user/alipay',
    params: {
      subject,
      totalAmount,
      body,
      isMobile,
    },
  })
}
/**
 * 根据订单号获取支付结果
 */
export const getPayResult = (out_trade_no) => {
  return request({
    url: '/sys/pay/result',
    params: {
      out_trade_no,
    },
  })
}
