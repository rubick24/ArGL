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
    let dirvec = vec3.create()
    if (direction == FreeMoveCamera.Movement.FORWARD) {
      vec3.scale(dirvec, this.front, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.BACKWARD) {
      vec3.scale(dirvec, this.front, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.LEFT) {
      vec3.scale(dirvec, this.right, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.RIGHT) {
      vec3.scale(dirvec, this.right, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.UP) {
      vec3.scale(dirvec, this.up, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.DOWN) {
      vec3.scale(dirvec, this.up, -step)
      this.translate(dirvec)
    }
  }


  desktopFreeMoveControl(currentlyPressedKeys, step, mouseInput, mouseSensitivity, keys = ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']) {
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
    if (currentlyPressedKeys.get(keys[6])) {
      this.roll(toRadian(-step * 5))
    }
    if (currentlyPressedKeys.get(keys[7])) {
      this.roll(toRadian(step * 5))
    }

    let radianX = toRadian(mouseInput.deltaX * mouseSensitivity)
    let radianY = toRadian(mouseInput.deltaY * mouseSensitivity)


    this.pitch(radianY)
    this.rotate(radianX, [0, 1, 0])
    this.processZoom(mouseInput.wheelDeltaY)
  }

}
FreeMoveCamera.Movement = CameraMovement

export default FreeMoveCamera
