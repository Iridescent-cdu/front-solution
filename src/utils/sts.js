import OSS from 'ali-oss'
import { getSts } from '@/api/mock/sys'
import { BUCKET, REGION } from '@/constants'

export const getOSSClient = async () => {
  const res = await getSts()
  return new OSS({
    // bucket所在区域
    region: REGION,
    // 阿里云账号、RAM用户或者临时访问凭证STS的AccessKey ID
    accessKeyId: res.Credentials.AccessKeyId,
    // 阿里云账号、RAM用户或者临时访问凭证STS的AccessKey Secret
    accessKeySecret: res.Credentials.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）
    stsToken: res.Credentials.SecurityToken,
    // bucket
    bucket: BUCKET,
    // 刷新token，在token过期后自动调用
    refreshSTSToken: async () => {
      const res = await getSts()
      return {
        // id
        accessKeyId: res.Credentials.AccessKeyId,
        // secret
        accessKeySecret: res.Credentials.AccessKeySecret,
        // token
        stsToken: res.Credentials.SecurityToken,
      }
    },
    refreshSTSTokenInterval: 5 * 1000,
  })
}
