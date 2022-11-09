import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'

// 处理中文国际化
dayjs.locale('zh')
// 插件：使用duration来获取时间戳对应的时长而不是时间
dayjs.extend(duration)

export default dayjs
