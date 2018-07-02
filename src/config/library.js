export const secondSwitch = second => { // 秒转换为时分秒格式
  let hour = parseInt(second / 3600),
      min = parseInt(second % 3600 / 60),
      sec = parseInt(second % 3600 % 60)
  if (hour > 0) {
    return `${hour}:${min < 10 ? '0' + min : min}:${sec}`
  } else if (min > 0) {
    return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
  } else {
    return `00:${sec < 10 ? '0' + sec : sec}`
  }
}

export const textLoop = (box, child, loopData) => { // 歌名过长会滚动
  /* 要求父元素overflow: hidden,子元素display: inline-block; white-space: nowrap  */
  var 
    boxWidth = box.offsetWidth,
    childWidth = child.offsetWidth
  clearInterval(loopData.timer)
  loopData.posX = 0
  if (boxWidth < childWidth) {
    let distance = boxWidth - childWidth
    let speed = -1
    loopData.timer = setInterval(() => {
      loopData.posX += speed
      if (loopData.posX <= distance - 10 || loopData.posX >= 10) {
        speed = -speed
      }
      if (!box || !child) {
        clearInterval(loopData.timer)
      }
    }, 50)
  }
  // console.log(loopData.timer)
}
