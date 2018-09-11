import Camera from './camera';
import { vec3 } from 'gl-matrix'

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
  constructor(position = [0, 0, 5], center = [0, 0, 0], orientation = [0, 0, 0, 1], zoom = 45) {
    super(position, orientation, zoom)
    this.center = center
    this.distance = vec3.distance(center, position)

  }

  processRotate(radianX, radianY) {
    if (radianX > Math.PI || radianY > Math.PI)
      return

    let flag = false || radianY > 0 && vec3.angle(this.front, [0, -1, 0]) < radianY
    flag = flag || radianY < 0 && vec3.angle(this.front, [0, 1, 0]) < -radianY

    if (flag)
      radianY = 0

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
