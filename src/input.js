
export default function Input(Argl) {
  Argl.desktopInput = function (el, options) {
    let currentlyPressedKeys = new Map()
    let mouseInput = {
      deltaX: 0,
      deltaY: 0,
      wheelDeltaY: 0
    }

    function handleKeyDown(e) {
      currentlyPressedKeys.set(e.key, true)
    }
    function handleKeyUp(e) {
      currentlyPressedKeys.set(e.key, false)
    }
    function mouse_callback(e) {
      mouseInput.deltaX = e.movementX || 0
      mouseInput.deltaY = e.movementY || 0
      if (mouseInput.drag) {
        mouseInput.dragX = e.movementX || 0
        mouseInput.dragY = e.movementY || 0
      }
    }
    function wheel_callback(e) {
      mouseInput.wheelDeltaY = e.wheelDeltaY
    }
    function handleDragStart(e) {
      mouseInput.drag = true
      mouseInput.dragX = 0
      mouseInput.dragY = 0
    }
    function handleDragEnd(e) {
      mouseInput.drag = false
    }
    function addInputListener() {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      document.addEventListener('mousemove', mouse_callback)
      document.addEventListener('mousedown', handleDragStart)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('wheel', wheel_callback)
    }
    function removeInputListener() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', mouse_callback)
      document.removeEventListener('mousedown', handleDragStart)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('wheel', wheel_callback)
    }

    if (options.lockPointer) {
      el.requestPointerLock = el.requestPointerLock ||
        el.mozRequestPointerLock
      el.exitPointerLock = el.exitPointerLock ||
        el.mozExitPointerLock
      el.onclick = function () {
        el.requestPointerLock()
      }
      document.addEventListener('pointerlockchange', handleLockChange, false)
      document.addEventListener('mozpointerlockchange', handleLockChange, false)
      function handleLockChange() {
        if (document.pointerLockElement === el ||
          document.mozPointerLockElement === el) {
          addInputListener()
        } else {
          removeInputListener()
        }
      }
    } else {
      el.contentEditable = 'true'
      el.style.cursor = 'default'
      el.addEventListener('focus', addInputListener)
      el.addEventListener('blur', removeInputListener)
    }

    return [currentlyPressedKeys, mouseInput]
  }

  Argl.touchInput = function (el) {

    const ongoingTouches = []
    // 移动端横屏 应在具体应用中实现
    //-----------
    // let tip = document.createElement('span')
    // tip.innerText = '横屏以获取最佳体验'

    // //screen.width screen.height
    // //window.innerHeight  window.innerWidth

    // function detectOrient(){
    //   if (screen.orientation.angle % 180 === 0) {
    //     self.el.appendChild(tip)
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight) -16)
    //   } else {
    //     tip.remove()
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight)  -16)
    //   }
    // }
    // detectOrient()
    // window.addEventListener('orientationchange',detectOrient)

    el.addEventListener("touchstart", handleStart, false)
    el.addEventListener("touchend", handleEnd, false)
    el.addEventListener("touchmove", handleMove, false)


    function handleStart(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let touch = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: touches[i].pageX,
          startY: touches[i].pageY,
          deltaX: 0,
          deltaY: 0,
          identifier: touches[i].identifier
        }
        ongoingTouches.push(touch)
      }
    }

    function handleEnd(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)
        ongoingTouches.splice(idx, 1)
      }
    }
    function handleMove(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)

        let touch = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: ongoingTouches[idx].startX,
          startY: ongoingTouches[idx].startY,
          deltaX: touches[i].pageX - ongoingTouches[idx].pageX,
          deltaY: touches[i].pageY - ongoingTouches[idx].pageY,
          identifier: touches[i].identifier
        }
        ongoingTouches.splice(idx, 1, touch)  // swap in the new touch record
      }

    }

    function ongoingTouchIndexById(idToFind) {
      for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1   // not found
    }

    return ongoingTouches
  }

}
