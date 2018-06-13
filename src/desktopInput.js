export default function desktopInput(Argl) {

  Argl.prototype.addDesktopInput = function () {
    this.mobile = false
    this.currentlyPressedKeys = {}
    this.mouseMovement = {
      x: 0,
      y: 0
    }
    this.wheelDeltaY = 0

    let self = this

    this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
      this.canvas.mozRequestPointerLock
    this.canvas.exitPointerLock = this.canvas.exitPointerLock ||
      this.canvas.mozExitPointerLock
    this.canvas.onclick = function () {
      self.canvas.requestPointerLock()
    }
    document.addEventListener('pointerlockchange', handleLockChange, false)
    document.addEventListener('mozpointerlockchange', handleLockChange, false)

    function handleKeyDown(e) {
      self.currentlyPressedKeys[e.key] = true
    }
    function handleKeyUp(e) {
      self.currentlyPressedKeys[e.key] = false
    }
    function mouse_callback(e) {
      self.mouseMovement.x = e.movementX || 0
      self.mouseMovement.y = e.movementY || 0
    }
    function wheel_callback(e) {
      self.wheelDeltaY = e.wheelDeltaY
    }

    function handleLockChange() {
      if (document.pointerLockElement === self.canvas ||
        document.mozPointerLockElement === self.canvas) {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        document.addEventListener('mousemove', mouse_callback)
        document.addEventListener('wheel', wheel_callback)
      } else {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
        document.removeEventListener('mousemove', mouse_callback)
        document.removeEventListener('wheel', wheel_callback)
      }

    }
  }
}
