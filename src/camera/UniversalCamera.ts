import { vec3, mat4, glMatrix } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'

enum DIRECTION {
  FORWARD,
  BACKWARD,
  LEFT,
  RIGHT,
  UP,
  DOWN
}

export default class UniversalCamera {
  public worldUp = vec3.fromValues(0, 1, 0)
  public minZoom = 1
  public maxZoom = 90

  constructor(
    public position: vec3,
    public yaw = 0,
    public pitch = 0,
    public zoom = 45
  ) {}
  public get right() {
    const right = vec3.create()
    vec3.cross(right, this.front, this.worldUp)
    vec3.normalize(right, right)
    return right
  }

  public get up() {
    const up = vec3.create()
    vec3.cross(up, this.right, this.front)
    vec3.normalize(up, up)
    return up
  }

  public get front() {
    const front = vec3.create()
    front[0] = Math.cos(this.yaw) * Math.cos(this.pitch)
    front[1] = Math.sin(this.pitch)
    front[2] = Math.sin(this.yaw) * Math.cos(this.pitch)
    vec3.normalize(front, front)
    return front
  }

  public get viewMatrix() {
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

    if (di.lockPointer) {
      const radianX = toRadian(di.mouseInput.move.x * mouseSensitivity)
      const radianY = toRadian(di.mouseInput.move.y * mouseSensitivity)
      this.yaw += radianX
      this.pitch -= radianY
    } else if (di.mouseInput.drag) {
      const radianX = (di.mouseInput.drag.x / di.el.clientWidth) * Math.PI * 2
      const radianY = (di.mouseInput.drag.y / di.el.clientHeight) * Math.PI * 2
      this.yaw += radianX
      this.pitch -= radianY
    }
    if (this.pitch > Math.PI / 2) {
      this.pitch = Math.PI / 2 - 0.00001
    } else if (this.pitch < -Math.PI / 2) {
      this.pitch = -Math.PI / 2 + 0.00001
    }
    this.zoomOut(di.mouseInput.wheel)
  }
}
