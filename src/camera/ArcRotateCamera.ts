import { vec3, mat4 } from 'gl-matrix'
import { DesktopInput } from '../input/DesktopInput'
import TouchInput from '../input/TouchInput'

const up = vec3.fromValues(0, 1, 0)

export default class ArcRotateCamera {
  public rotationMatrix: mat4 = mat4.identity(mat4.create())
  public maxAlphaLimit = Math.PI * 2
  public minAlphaLimit = -Math.PI * 2
  public maxBetaLimit = Math.PI
  public minBetaLimit = 0

  private _viewMatrix: mat4 = mat4.create()
  private _position: vec3 = vec3.create()
  private _tempMat4: mat4 = mat4.create()
  private _tempAxis: vec3 = vec3.create()
  private _tempUp: vec3 = vec3.create()

  constructor(
    public target: vec3,
    public alpha: number,
    public beta: number,
    public radius: number,
    public fovY = Math.PI / 4,
    public allowUpsideDown = true
  ) {
    this.updateViewMatrix()
    return new Proxy(this, {
      set: (t, key, value, receiver) => {
        const result = Reflect.set(t, key, value, receiver)
        const observable = ['alpha', 'beta', 'radius', 'target']
        if (observable.some(v => v === key)) {
          t._checkLimit()
          t.updateViewMatrix()
        }
        return result
      }
    })
  }

  public get viewMatrix() {
    return this._viewMatrix
  }

  public get position() {
    return this._position
  }

  public get up() {
    const m = this.rotationMatrix
    this._tempUp[0] = m[1]
    this._tempUp[1] = m[5]
    this._tempUp[2] = m[9]
    return this._tempUp
  }

  public _checkLimit() {
    this.alpha = this.alpha % (Math.PI * 2)
    this.beta = this.beta % (Math.PI * 2)
    if (this.alpha > this.maxAlphaLimit) {
      this.alpha = this.maxAlphaLimit
    } else if (this.alpha < this.minAlphaLimit) {
      this.alpha = this.minAlphaLimit
    }
    if (this.beta > this.maxBetaLimit) {
      this.beta = this.maxBetaLimit
    } else if (this.beta < this.minBetaLimit) {
      this.beta = this.minBetaLimit
    }
    if (this.radius <= 0.1) {
      this.radius = 0.1
    }
  }

  public updateViewMatrix() {
    const cosA = Math.cos(this.alpha)
    const sinA = Math.sin(this.alpha)
    const cosB = Math.cos(this.beta)
    const sinB = Math.sin(this.beta) !== 0 ? Math.sin(this.beta) : Number.EPSILON

    if (!vec3.equals(this.up, up)) {
      vec3.cross(this._tempAxis, up, this.up)
      vec3.normalize(this._tempAxis, this._tempAxis)
      const angle = Math.acos(vec3.dot(up, this._tempAxis))
      mat4.fromRotation(this.rotationMatrix, angle, this._tempAxis)
    }
    const trans = vec3.fromValues(
      this.radius * cosA * sinB,
      this.radius * cosB,
      this.radius * sinA * sinB
    )
    // vec3.normalize(trans, trans)
    vec3.transformMat4(trans, trans, this.rotationMatrix)
    vec3.add(this._position, this.target, trans)
    mat4.lookAt(this._viewMatrix, this.position, this.target, this.up)
  }

  public getProjectionMatrix(aspect: number, near: number, far: number): mat4 {
    // return mat4.ortho(this._tempMat4, -aspect*3, aspect*3, -3, 3, near, far)
    return mat4.perspective(this._tempMat4, this.fovY, aspect, near, far)
  }
  public getOrthographicProjectionMatrix(
    width: number,
    height: number,
    near: number,
    far: number
  ): mat4 {
    const hw = width / 2
    const hh = height / 2
    return mat4.ortho(this._tempMat4, -hw, hw, -hh, hh, near, far)
  }

  public processDesktopInput(di: DesktopInput) {
    if (di.mouseInput.dragging) {
      const deltaX = di.mouseInput.x - di.mouseInput.lastX
      const deltaY = di.mouseInput.y - di.mouseInput.lastY
      const radianX = (deltaX / di.el.clientWidth) * Math.PI * 2
      const radianY = -(deltaY / di.el.clientHeight) * Math.PI * 2
      this.alpha += radianX
      this.beta += radianY
    }
    const deltaWheel = di.mouseInput.lastWheel - di.mouseInput.wheel
    this.radius += deltaWheel / 1000
  }

  public processTouchInput(ti: TouchInput) {
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
      this.alpha += radianX
      this.beta += radianY
    }
  }
}
