/**
 * 从itemElement 中抽离出素有的imgElements
 */
export const getImgElements = (itemElements) => {
  const imgElements = []
  itemElements.forEach((el) => {
    imgElements.push(...el.getElementsByTagName('img'))
  })
  return imgElements
}
/**
 * 生成所有的图片链接数组
 */
export const getAllImg = (imgElements) => {
  return imgElements.map((imgElement) => {
    return imgElement.src
  })
}
/**
 * 监听图片数组加载完成(promise)
 */
export const onComplateImgs = (imgs) => {
  // promise集合
  const promiseAll = []
  imgs.forEach((img, index) => {
    promiseAll[index] = new Promise((resolve) => {
      // 处理img的加载情况
      const imageObj = new Image()
      imageObj.src = img
      imageObj.onload = () => {
        resolve({
          img,
          index,
        })
      }
    })
  })
  return Promise.all(promiseAll)
}

/**
 * 返回列高对象中最小的高度作为定位的top值
 */
export const getMinHeight = (columnHeightObj) => {
  const columnHeightArr = Object.values(columnHeightObj)
  return Math.min(...columnHeightArr)
}
/**
 * 返回列高对象中最大的高度作为容器的高度
 */
export const getMaxHeight = (columnHeightObj) => {
  const columnHeightArr = Object.values(columnHeightObj)
  return Math.max(...columnHeightArr)
}

/**
 * 返回列高对象中最小高度所在的列来参与下一项定位的left值计算
 */
export const getMinHeightColumn = (columnHeightObj) => {
  // 拿到最小的高度
  const minHeight = getMinHeight(columnHeightObj)
  return Object.keys(columnHeightObj).find((key) => {
    return columnHeightObj[key] === minHeight
  })
}
