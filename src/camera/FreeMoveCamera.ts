import { vec3, quat, mat4, glMatrix } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'

enum DIRECTION {
  FORWARD,
  BACKWARD,
  LEFT,
  RIGHT,
  UP,
  DOWN
}

export default class FreeMoveCamera {
  public minZoom = 1
  public maxZoom = 90

  constructor(
    public position = vec3.fromValues(0, 0, 0),
    public orientation = quat.fromValues(0, 0, 0, 1),
    public zoom = 45
  ) {
    zoom = zoom > this.minZoom ? zoom : this.minZoom
    zoom = zoom < this.maxZoom ? zoom : this.maxZoom
    this.zoom = zoom
  }

  public get right() {
    const m = mat4.fromQuat(mat4.create(), this.orientation)
    return vec3.fromValues(-m[0], -m[4], -m[8])
  }

  public get up() {
    const m = mat4.fromQuat(mat4.create(), this.orientation)
    return vec3.fromValues(m[1], m[5], m[9])
  }

  public get front() {
    const m = mat4.fromQuat(mat4.create(), this.orientation)
    return vec3.fromValues(m[2], m[6], m[10])
  }

  public getViewMatrix() {
    const center = vec3.add(vec3.create(), this.position, this.front)
    const view = mat4.lookAt(mat4.create(), this.position, center, this.up)

    return view
  }

  public getProjectionMatrix(aspect: number, near: number, far: number) {
    return mat4.perspective(
      mat4.create(),
      glMatrix.toRadian(this.zoom),
      aspect,
      near,
      far
    )
  }

  public translate(v: vec3) {
    vec3.add(this.position, this.position, v)
    // this.position += v * this.orientation
  }

  public rotate(angle: number, axis: vec3) {
    quat.mul(
      this.orientation,
      this.orientation,
      quat.setAxisAngle(quat.create(), axis, angle)
    )
    // this.orientation *= glm.angleAxis(angle, axis * this.orientation)
  }

  public yaw(angle: number) {
    this.rotate(angle, this.up)
  }

  public pitch(angle: number) {
    this.rotate(angle, this.right)
  }

  public roll(angle: number) {
    this.rotate(angle, this.front)
  }

  public zoomOut(deltaZoom: number) {
    if (this.zoom >= this.minZoom && this.zoom <= this.maxZoom) {
      this.zoom += deltaZoom
    }
    if (this.zoom <= this.minZoom) {
      this.zoom = this.minZoom
    }
    if (this.zoom >= this.maxZoom) {
      this.zoom = this.maxZoom
    }
  }

  /**
   *
   * @param direction in this.DIRECTION
   * @param step
   */
  public move(direction: DIRECTION, step: number) {
    if (direction === DIRECTION.FORWARD) {
      this.translate(vec3.scale(vec3.create(), this.front, step))
    }
    if (direction === DIRECTION.BACKWARD) {
      this.translate(vec3.scale(vec3.create(), this.front, -step))
    }
    if (direction === DIRECTION.LEFT) {
      this.translate(vec3.scale(vec3.create(), this.right, -step))
    }
    if (direction === DIRECTION.RIGHT) {
      this.translate(vec3.scale(vec3.create(), this.right, step))
    }
    if (direction === DIRECTION.UP) {
      this.translate(vec3.scale(vec3.create(), this.up, step))
    }
    if (direction === DIRECTION.DOWN) {
      this.translate(vec3.scale(vec3.create(), this.up, -step))
    }
  }

  public processDesktopInput(
    di: DesktopInput,
    step: number,
    mouseSensitivity: number,
    keys = ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']
  ) {
    const currentlyPressedKeys = di.currentlyPressedKeys
    if (currentlyPressedKeys.get(keys[0])) {
      this.move(DIRECTION.FORWARD, step)
    }
    if (currentlyPressedKeys.get(keys[1])) {
      this.move(DIRECTION.BACKWARD, step)
    }
    if (currentlyPressedKeys.get(keys[2])) {
      this.move(DIRECTION.LEFT, step)
    }
    if (currentlyPressedKeys.get(keys[3])) {
      this.move(DIRECTION.RIGHT, step)
    }
    if (currentlyPressedKeys.get(keys[4])) {
      this.move(DIRECTION.UP, step)
    }
    if (currentlyPressedKeys.get(keys[5])) {
      this.move(DIRECTION.DOWN, step)
    }

    const toRadian = (degree: number) => (degree / 180) * Math.PI
    if (di.currentlyPressedKeys.get(keys[6])) {
      this.roll(toRadian(-step * 5))
    }
    if (di.currentlyPressedKeys.get(keys[7])) {
      this.roll(toRadian(step * 5))
    }

    if (di.options.lockPointer) {
      const radianX = toRadian(di.mouseInput.move.x * mouseSensitivity)
      const radianY = toRadian(di.mouseInput.move.y * mouseSensitivity)
      this.pitch(radianY)
      this.rotate(radianX, vec3.fromValues(0, 1, 0))
    } else if (di.mouseInput.drag) {
      const radianX = (di.mouseInput.drag.x / di.el.clientWidth) * Math.PI * 2
      const radianY = (di.mouseInput.drag.y / di.el.clientHeight) * Math.PI * 2
      this.pitch(radianY)
      this.rotate(radianX, vec3.fromValues(0, 1, 0))
    }

    this.zoomOut(di.mouseInput.wheel)
  }
}
