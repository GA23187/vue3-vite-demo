const watermark: any = {}
let observer: any = null

const setWatermark = (str: string) => {
  const id = '123456789'

  if (document.getElementById(id)) {
    document.body.removeChild(document.getElementById(id)!)
  }

  const canvas = document.createElement('canvas')
  canvas.width = 250
  canvas.height = 150

  const ctx = canvas.getContext('2d')!
  ctx.rotate((-15 * Math.PI) / 150)
  ctx.font = '14px Vedana'
  ctx.fillStyle = 'rgba(100, 100, 100, 0.10)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(str, canvas.width / 8, canvas.height / 2)

  const markNode = document.createElement('div')
  markNode.id = id
  markNode.style.pointerEvents = 'none'
  markNode.style.top = '30px'
  markNode.style.left = '0px'
  markNode.style.position = 'fixed'
  markNode.style.zIndex = '99999'
  markNode.style.width = `${document.documentElement.clientWidth}px`
  markNode.style.height = `${document.documentElement.clientHeight}px`
  markNode.style.background = `url(${canvas.toDataURL('image/png')}) left top repeat`
  document.body.appendChild(markNode)

  return id
}

function createObserver(id, args) {
  // 创建观察器实例并传入回调，也就是我们设置水印的函数
  const observer = new MutationObserver(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(args)
    }
  })
  /**
   * 开始监听目标节点
   * @param {boolean}  attributes   元素属性变动
   * @param {boolean}  childList    元素子节点变动
   * @param {boolean}  subtree      元素所有后代节点变动
   */
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
  })
  return observer
}

// 该方法只允许调用一次
watermark.set = (str) => {
  const id = setWatermark(str)

  // const keepWater = () => {
  //   console.log(123)
  //   if (!document.getElementById(id)) {
  //     id = setWatermark(str)
  //   } else {
  //     requestAnimationFrame(keepWater)
  //   }
  // }
  // requestAnimationFrame(keepWater)

  // 创建观察器检测如果水印被去掉了，自动给加上
  observer = createObserver(id, str)
  //在窗口大小改变之后,自动触发加水印事件
  window.onresize = () => {
    setWatermark(str)
  }
}

const outWatermark = (id) => {
  if (document.getElementById(id)) {
    // 水印清除之前调用取消监听，再清除水印
    console.log(observer, 'observer')
    observer.disconnect()
    const div = document.getElementById(id)!
    div.style.display = 'none'
  }
}
watermark.out = () => {
  const str = '123456789'
  outWatermark(str)
}

export default watermark
