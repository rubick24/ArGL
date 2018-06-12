import * as glm from 'gl-matrix';

const CameraMovement = Object.freeze({
  FORWARD: 1,
  BACKWARD: 2,
  LEFT: 3,
  RIGHT: 4,
  UP: 5,
  DOWN: 6
})

const YAW = -90.0
const PITCH = 0.0
const SPEED = 0.005
const SENSITIVITY = 0.05
const ZOOM = 45.0

class Camera {

  constructor(position = [0.0, 0.0, 0.0],
    up = [0.0, 1.0, 0.0],
    yaw = YAW,
    pitch = PITCH,
    front = [0.0, 0.0, -1.0],
    movementSpeed = SPEED,
    mouseSensitivity = SENSITIVITY,
    zoom = ZOOM) {
    this.position = position
    this.worldUp = up
    this.yaw = yaw
    this.pitch = pitch
    this.front = front
    this.right = [1.0, 0.0, 0.0]
    this.up = [0.0, 1.0, 0.0]
    this.movementSpeed = movementSpeed
    this.mouseSensitivity = mouseSensitivity
    this.zoom = zoom
    this.updateCameraVectors()
  }

  getViewMatrix() {
    let view = glm.mat4.create()
    let center = glm.vec3.create()
    glm.vec3.add(center, this.position, this.front)
    glm.mat4.lookAt(view, this.position, center, this.up)
    return view
  }

  processMove(direction, deltaTime) {
    let velocity = this.movementSpeed * deltaTime
    let temp1 = glm.vec3.create()

    if (direction == CameraMovement.FORWARD) {
      glm.vec3.scale(temp1, this.front, velocity)
      glm.vec3.add(this.position, this.position, temp1)
    }
    if (direction == CameraMovement.BACKWARD) {
      glm.vec3.scale(temp1, this.front, velocity)
      glm.vec3.sub(this.position, this.position, temp1)
    }
    if (direction == CameraMovement.LEFT) {
      glm.vec3.scale(temp1, this.right, velocity)
      glm.vec3.sub(this.position, this.position, temp1)
    }
    if (direction == CameraMovement.RIGHT) {
      glm.vec3.scale(temp1, this.right, velocity)
      glm.vec3.add(this.position, this.position, temp1)
    }
    if (direction == CameraMovement.UP) {
      glm.vec3.scale(temp1, this.up, velocity)
      glm.vec3.add(this.position, this.position, temp1)
    }
    if (direction == CameraMovement.DOWN) {
      glm.vec3.scale(temp1, this.up, velocity)
      glm.vec3.sub(this.position, this.position, temp1)
    }
  }

  processViewAngle(xoffset, yoffset, constrainPitch = true) {
    xoffset *= this.mouseSensitivity
    yoffset *= this.mouseSensitivity

    this.yaw += xoffset
    this.pitch += yoffset
    if (constrainPitch) {
      if (this.pitch > 89.0)
        this.pitch = 89.0
      if (this.pitch < -89.0)
        this.pitch = -89.0
    }
    this.updateCameraVectors()
  }

  processMouseScroll(yoffset) {
    if (this.zoom >= 1.0 && this.zoom <= 45.0)
      this.zoom -= yoffset / 200
    if (this.zoom <= 1.0)
      this.zoom = 1.0
    if (this.zoom >= 45.0)
      this.zoom = 45.0
  }

  updateCameraVectors() {
    let front = glm.vec3.create()
    front[0] = Math.cos(glm.glMatrix.toRadian(this.yaw)) * Math.cos(glm.glMatrix.toRadian(this.pitch))
    front[1] = Math.sin(glm.glMatrix.toRadian(this.pitch))
    front[2] = Math.sin(glm.glMatrix.toRadian(this.yaw)) * Math.cos(glm.glMatrix.toRadian(this.pitch))
    glm.vec3.normalize(this.front, front)

    let right = glm.vec3.create()
    glm.vec3.cross(right, this.front, this.worldUp)
    glm.vec3.normalize(this.right, right)

    let up = glm.vec3.create()
    glm.vec3.cross(up, this.right, this.front)
    glm.vec3.normalize(this.up, up)
  }

}

Camera.Movement = CameraMovement

export default Camera
