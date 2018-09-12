import Camera from './camera';
import { vec3, quat } from 'gl-matrix'

function rotateVec(vec, normal, angle) {
  let direction = vec3.create()
  let t1 = vec3.create()
  let t2 = vec3.create()

  vec3.normalize(normal, normal)

  vec3.scale(t1, vec, Math.cos(angle))
  vec3.cross(t2, normal, vec)
  vec3.scale(t2, t2, Math.sin(angle))
  vec3.add(direction, t1, t2)
  vec3.normalize(direction, direction)
  return direction
}

class OrbitCamera extends Camera {
  constructor(position = [0, 0, 5], center = [0, 0, 0], zoom = 45) {
    let direction = vec3.create()
    vec3.sub(direction, center, position)
    vec3.normalize(direction, direction)

    let dirX = [direction[0], 0, direction[2]]
    let dirY = [0, direction[1], Math.sqrt(1 - direction[1] ** 2)]
    let angleX = vec3.length(dirX) === 0 ? 0 : vec3.angle([0, 0, 1], dirX)
    angleX = direction[0] > 0 ? -angleX : angleX
    let angleY = vec3.length(dirY) === 0 ? 0 : vec3.angle([0, 0, 1], dirY)
    angleY = direction[1] > 0 ? -angleY : angleY
    console.log(direction, angleX, angleY)
    console.log(dirX, dirY)
    let orientation = quat.create()

    super(position, orientation, zoom)
    this.yaw(angleX)
    this.pitch(angleY)

    this.center = center
    this.distance = vec3.distance(center, position)

  }

  processRotate(radianX, radianY) {

    let t1 = vec3.create()
    vec3.scale(t1, this.front, -1)
    t1 = rotateVec(t1, [0, 1, 0], -radianX)

    let t2 = vec3.create()
    vec3.cross(t2, this.up, t1)
    t1 = rotateVec(t1, t2, -radianY)
    vec3.scale(t1, t1, this.distance)
    this.position = t1

    this.rotate(radianX, [0, 1, 0])
    this.pitch(radianY)

  }

  orbitControl(argl) {
    if (argl.mouseInput.drag) {
      let radianX = argl.mouseInput.dragX / argl.canvas.clientWidth * Math.PI * 2
      let radianY = argl.mouseInput.dragY / argl.canvas.clientHeight * Math.PI * 2
      this.processRotate(radianX, radianY)
    }
    this.processZoom(argl.mouseInput.wheelDeltaY)
  }

}

export default OrbitCamera
