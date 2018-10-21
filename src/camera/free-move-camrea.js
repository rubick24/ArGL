import Camera from './camera'

import { vec3 } from 'gl-matrix'

const CameraMovement = {
  FORWARD: 0,
  BACKWARD: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4,
  DOWN: 5
}

class FreeMoveCamera extends Camera {

  processMove(direction, step) {
    if (direction == FreeMoveCamera.Movement.FORWARD) {
      this.translate(vec3.scale([], this.front, step))
    }
    if (direction == FreeMoveCamera.Movement.BACKWARD) {
      this.translate(vec3.scale([], this.front, -step))
    }
    if (direction == FreeMoveCamera.Movement.LEFT) {
      this.translate(vec3.scale([], this.right, -step))
    }
    if (direction == FreeMoveCamera.Movement.RIGHT) {
      this.translate(vec3.scale([], this.right, step))
    }
    if (direction == FreeMoveCamera.Movement.UP) {
      this.translate(vec3.scale([], this.up, step))
    }
    if (direction == FreeMoveCamera.Movement.DOWN) {
      this.translate(vec3.scale([], this.up, -step))
    }
  }

  desktopFreeMoveControl(argl, step, mouseSensitivity, keys = ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']) {
    let currentlyPressedKeys = argl.currentlyPressedKeys
    if (currentlyPressedKeys.get(keys[0])) {
      this.processMove(FreeMoveCamera.Movement.FORWARD, step)
    }
    if (currentlyPressedKeys.get(keys[1])) {
      this.processMove(FreeMoveCamera.Movement.BACKWARD, step)
    }
    if (currentlyPressedKeys.get(keys[2])) {
      this.processMove(FreeMoveCamera.Movement.LEFT, step)
    }
    if (currentlyPressedKeys.get(keys[3])) {
      this.processMove(FreeMoveCamera.Movement.RIGHT, step)
    }
    if (currentlyPressedKeys.get(keys[4])) {
      this.processMove(FreeMoveCamera.Movement.UP, step)
    }
    if (currentlyPressedKeys.get(keys[5])) {
      this.processMove(FreeMoveCamera.Movement.DOWN, step)
    }

    let toRadian = degree => degree / 180 * Math.PI
    if (argl.currentlyPressedKeys.get(keys[6])) {
      this.roll(toRadian(-step * 5))
    }
    if (argl.currentlyPressedKeys.get(keys[7])) {
      this.roll(toRadian(step * 5))
    }

    if (argl.options.desktopInput && argl.options.desktopInput.lockPointer !== false) {
      let radianX = toRadian(argl.mouseInput.deltaX * mouseSensitivity)
      let radianY = toRadian(argl.mouseInput.deltaY * mouseSensitivity)
      this.pitch(radianY)
      this.rotate(radianX, [0, 1, 0])
    } else {
      if (argl.mouseInput.drag) {
        let radianX = argl.mouseInput.dragX / argl.canvas.clientWidth * Math.PI * 2
        let radianY = argl.mouseInput.dragY / argl.canvas.clientHeight * Math.PI * 2
        this.pitch(radianY)
        this.rotate(radianX, [0, 1, 0])
      }
    }

    this.processZoom(argl.mouseInput.wheelDeltaY)
  }

}
FreeMoveCamera.Movement = CameraMovement

export default FreeMoveCamera
