import { isMobileTerminal } from './flexible'
import { getAliPay } from '@/api/mock/pay'
/**
 * 触发支付宝支付
 * @param {*} title 支付标题
 * @param {*} desc 支付的描述
 */
export const alipay = async (title, desc) => {
  const { encodeURI } = await getAliPay(title, '0.01', desc, isMobileTerminal.value)
  window.location.href = decodeURIComponent(encodeURI)
}
