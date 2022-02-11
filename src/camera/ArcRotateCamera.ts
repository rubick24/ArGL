import { vec3, mat4 } from 'gl-matrix'
import { DesktopInput } from '../input/DesktopInput'
import TouchInput from '../input/TouchInput'

const globalUp = vec3.fromValues(0, 1, 0)

export type ArcRotateCamera = {
  alpha: number
  beta: number
  target: vec3
  radius: number
  readonly viewMatrix: mat4
  readonly position: vec3
  readonly up: vec3
  getProjectionMatrix(aspect: number, near: number, far: number): mat4
  getOrthographicProjectionMatrix(width: number, height: number, near: number, far: number): mat4
  processDesktopInput(di: DesktopInput): void
  processTouchInput(ti: TouchInput): void
}

export const createCamera = (options: {
  target: vec3
  alpha: number
  beta: number
  radius: number
  fovY?: number
}): ArcRotateCamera => {
  let { target, alpha, beta, radius } = options
  let fovY = options.fovY || Math.PI / 4

  const rotationMatrix: mat4 = mat4.create()
  const maxAlphaLimit = Math.PI * 2
  const minAlphaLimit = -Math.PI * 2
  const maxBetaLimit = Math.PI
  const minBetaLimit = 0

  const viewMatrix: mat4 = mat4.create()
  const position: vec3 = vec3.create()
  const tempMat4: mat4 = mat4.create()
  const tempAxis: vec3 = vec3.create()
  const up: vec3 = vec3.create()

  const updateViewMatrix = () => {
    const cosA = Math.cos(alpha)
    const sinA = Math.sin(alpha)
    const cosB = Math.cos(beta)
    const sinB = Math.sin(beta) !== 0 ? Math.sin(beta) : Number.EPSILON

    if (!vec3.equals(up, globalUp)) {
      vec3.cross(tempAxis, globalUp, up)
      vec3.normalize(tempAxis, tempAxis)
      const angle = Math.acos(vec3.dot(globalUp, tempAxis))
      mat4.fromRotation(rotationMatrix, angle, tempAxis)
    }
    const trans = vec3.fromValues(radius * cosA * sinB, radius * cosB, radius * sinA * sinB)
    // vec3.normalize(trans, trans)
    vec3.transformMat4(trans, trans, rotationMatrix)
    vec3.add(position, target, trans)
    mat4.lookAt(viewMatrix, position, target, up)
  }

  const checkLimit = () => {
    alpha = alpha % (Math.PI * 2)
    beta = beta % (Math.PI * 2)
    if (alpha > maxAlphaLimit) {
      alpha = maxAlphaLimit
    } else if (alpha < minAlphaLimit) {
      alpha = minAlphaLimit
    }
    if (beta > maxBetaLimit) {
      beta = maxBetaLimit
    } else if (beta < minBetaLimit) {
      beta = minBetaLimit
    }
    if (radius <= 0.1) {
      radius = 0.1
    }
  }

  checkLimit()
  updateViewMatrix()

  return {
    get alpha() {
      return beta
    },
    set alpha(v) {
      beta = v
      checkLimit()
      updateViewMatrix()
    },
    get beta() {
      return beta
    },
    set beta(v) {
      beta = v
      checkLimit()
      updateViewMatrix()
    },
    get target() {
      return target
    },
    set target(v) {
      target = v
      checkLimit()
      updateViewMatrix()
    },
    get radius() {
      return radius
    },
    set radius(v) {
      radius = v
      checkLimit()
      updateViewMatrix()
    },
    get viewMatrix() {
      return viewMatrix
    },
    get position() {
      return position
    },
    get up() {
      const m = rotationMatrix
      up[0] = m[1]
      up[1] = m[5]
      up[2] = m[9]
      return up
    },
    getProjectionMatrix(aspect: number, near: number, far: number): mat4 {
      return mat4.perspective(tempMat4, fovY, aspect, near, far)
    },
    getOrthographicProjectionMatrix(
      width: number,
      height: number,
      near: number,
      far: number
    ): mat4 {
      const hw = width / 2
      const hh = height / 2
      return mat4.ortho(tempMat4, -hw, hw, -hh, hh, near, far)
    },
    processDesktopInput(di: DesktopInput) {
      if (di.mouseInput.dragging) {
        const deltaX = di.mouseInput.x - di.mouseInput.lastX
        const deltaY = di.mouseInput.y - di.mouseInput.lastY
        const radianX = (deltaX / di.el.clientWidth) * Math.PI * 2
        const radianY = -(deltaY / di.el.clientHeight) * Math.PI * 2
        alpha += radianX
        beta += radianY
      }
      const deltaWheel = di.mouseInput.lastWheel - di.mouseInput.wheel
      radius += deltaWheel / 1000
    },
    processTouchInput(ti: TouchInput) {
      const deltas = ti.touchList.map((touch, i) => {
        const lastTouch = ti.lastTouchList.find(v => v.identifier === touch.identifier)
        if (lastTouch) {
          return {
            deltaX: touch.screenX - lastTouch.screenX,
            deltaY: touch.screenY - lastTouch.screenY
          }
        } else {
          return { deltaX: 0, deltaY: 0 }
        }
      })
      if (deltas.length === 1) {
        const radianX = (deltas[0].deltaX / ti.el.clientWidth) * Math.PI
        const radianY = -(deltas[0].deltaY / ti.el.clientHeight) * Math.PI
        alpha += radianX
        beta += radianY
      }
    }
  }
}
