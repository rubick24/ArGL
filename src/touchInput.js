export default function touchInput(Argl){

  Argl.prototype.addTouchInput = function () {
    this.mobile = true

    let self = this

    // 移动端横屏 应在具体应用中实现
    //-----------
    // let tip = document.createElement('span')
    // tip.innerText = '横屏以获取最佳体验'

    // //screen.width screen.height
    // //window.innerHeight  window.innerWidth

    // function detectOrient(){
    //   if (screen.orientation.angle % 180 === 0) {
    //     self.el.appendChild(tip)
    //     self.canvas.width = Math.min(self.options.width, screen.width-16)
    //     self.canvas.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight) -16)
    //   } else {
    //     tip.remove()
    //     self.canvas.width = Math.min(self.options.width, screen.width-16)
    //     self.canvas.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight)  -16)
    //   }
    // }
    // detectOrient()
    // window.addEventListener('orientationchange',detectOrient)

    this.canvas.addEventListener("touchstart", handleStart, false)
    this.canvas.addEventListener("touchend", handleEnd, false)
    this.canvas.addEventListener("touchmove", handleMove, false)

    this.ongoingTouches = new Array()
    function handleStart(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        touches[i].startX = touches[i].pageX
        touches[i].startY = touches[i].pageY
        touches[i].deltaX = 0
        touches[i].deltaY = 0
        self.ongoingTouches.push(touches[i])
      }
    }

    function handleEnd(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)
        touches[i].pageX
        touches[i].pageY
        self.ongoingTouches.splice(i, 1)
      }
    }
    function handleMove(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)

        touches[i].startX = self.ongoingTouches[idx].startX
        touches[i].startY = self.ongoingTouches[idx].startY
        touches[i].deltaX = touches[i].pageX - self.ongoingTouches[idx].pageX
        touches[i].deltaY = touches[i].pageY - self.ongoingTouches[idx].pageY

        // console.log(self.ongoingTouches[idx].pageX, touches[i].pageX, self.ongoingTouches[0])
        self.ongoingTouches.splice(idx, 1, touches[i])  // swap in the new touch record
      }

    }

    function ongoingTouchIndexById(idToFind) {
      for (let i = 0; i < self.ongoingTouches.length; i++) {
        let id = self.ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1   // not found
    }
  }

}
