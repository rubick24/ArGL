import { vec3, mat4, quat } from 'gl-matrix'

class Camera {
  constructor(position = [0, 0, 0], orientation = [0, 0, 0, 1], zoom = 45) {
    this.position = position
    this.orientation = orientation
    this.zoom = zoom
    this.update()
  }

  getViewMatrix() {
    this.update()
    let center = vec3.add([], this.position, this.front)
    let view = mat4.lookAt([], this.position, center, this.up)
    return view
  }

  translate(v) {
    vec3.add(this.position, this.position, v)
    // this.position += v * this.orientation
  }

  rotate(angle, axis) {
    quat.mul(this.orientation, this.orientation, quat.setAxisAngle([], axis, angle))
    // this.orientation *= glm.angleAxis(angle, axis * this.orientation)
    this.update()
  }

  yaw(angle) {
    this.rotate(angle, this.up)
  }
  pitch(angle) {
    this.rotate(angle, this.right)
  }
  roll(angle) {
    this.rotate(angle, this.front)
  }

  update() {
    let m = mat4.fromQuat([], this.orientation)
    this.right = [-m[0], -m[4], -m[8]]
    this.up = [m[1], m[5], m[9]]
    this.front = [m[2], m[6], m[10]]
  }

  processZoom(yoffset) {
    if (this.zoom >= 1.0 && this.zoom <= 45.0)
      this.zoom -= yoffset / 200
    if (this.zoom <= 1.0)
      this.zoom = 1.0
    if (this.zoom >= 45.0)
      this.zoom = 45.0
  }
}

export default Camera
