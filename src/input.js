import * as Hammer from 'hammerjs'

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
    function handleDragStart() {
      mouseInput.drag = true
      mouseInput.dragX = 0
      mouseInput.dragY = 0
    }
    function handleDragEnd() {
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

    return { currentlyPressedKeys, mouseInput }
  }

  Argl.touchInput = function (el) {

    let pan = {
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0
    }
    let pitch = {
      scale: 0,
      lastScale: 1
    }
    let hammer = new Hammer.Manager(el)
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 }))
    hammer.add(new Hammer.Pinch({ threshold: 0 }))

    hammer.on('panstart', function (e) {
      pan.lastX = 0
      pan.lastY = 0
      pan.deltaX = e.deltaX
      pan.deltaY = e.deltaY
    })
    hammer.on('panmove', function (e) {
      pan.deltaX = e.deltaX - pan.lastX
      pan.deltaY = e.deltaY - pan.lastY
      pan.lastX = e.deltaX
      pan.lastY = e.deltaY
    })

    hammer.on('pinchstart', function () {
      pitch.scale = 0
      pitch.lastScale = 1
    })
    hammer.on('pinchmove', function (e) {
      pitch.scale = e.scale / pitch.lastScale - 1
      pitch.lastScale = e.scale
    })

    return { pan, pitch }
  }

}
