import { vec3, mat4, glMatrix } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'
import TouchInput from '../input/TouchInput'

export default class ArcRotateCamre {
  public rotationMatrix = mat4.identity(mat4.create())
  public maxAlphaLimit = Math.PI * 2
  public minAlphaLimit = -Math.PI * 2
  public maxBetaLimit = Math.PI
  public minBetaLimit = 0

  private _viewMaxtrix = mat4.create()
  private _position = vec3.create()

  constructor(
    public target: vec3,
    public alpha: number,
    public beta: number,
    public radius: number,
    public allowUpsideDown = true
  ) {
    this.updateViewMatrix()
    return new Proxy(this, {
      set: (t, key, value, receiver) => {
        const result = Reflect.set(t, key, value, receiver)
        const observable = ['alpha', 'beta', 'radius']
        if (observable.some(v => v === key)) {
          t._checkLimit()
          t.updateViewMatrix()
        }
        return result
      }
    })
  }

  public get viewMatrix() {
    return this._viewMaxtrix
  }

  public get position() {
    return this._position
  }

  public get up() {
    const m = this.rotationMatrix
    return vec3.fromValues(m[1], m[5], m[9])
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
  }

  public updateViewMatrix() {
    const cosa = Math.cos(this.alpha)
    const sina = Math.sin(this.alpha)
    const cosb = Math.cos(this.beta)
    const sinb = Math.sin(this.beta) !== 0 ? Math.sin(this.beta) : 0.0001

    const up = vec3.fromValues(0, 1, 0)
    const axis = vec3.create()
    if (!vec3.equals(this.up, up)) {
      vec3.cross(axis, up, this.up)
      vec3.normalize(axis, axis)
      const angle = Math.acos(vec3.dot(up, axis))
      this.rotationMatrix = mat4.fromRotation(mat4.create(), angle, axis)
    }
    const trans = vec3.fromValues(
      this.radius * cosa * sinb,
      this.radius * cosb,
      this.radius * sina * sinb
    )
    vec3.normalize(axis, trans)
    vec3.transformMat4(trans, trans, this.rotationMatrix)
    this._position = vec3.add(this._position, this.target, trans)
    mat4.lookAt(this._viewMaxtrix, this.position, this.target, this.up)
  }

  public getProjectionMatrix(aspect: number, near: number, far: number) {
    return mat4.perspective(
      mat4.create(),
      glMatrix.toRadian(45),
      aspect,
      near,
      far
    )
  }

  public processDesktopInput(di: DesktopInput) {
    if (di.mouseInput.drag) {
      const radianX = (di.mouseInput.drag.x / di.el.clientWidth) * Math.PI * 2
      const radianY = -(di.mouseInput.drag.y / di.el.clientHeight) * Math.PI * 2
      this.alpha += radianX
      this.beta += radianY
    }
    // process zoom here
    // di.mouseInput.wheel
  }

  public processTouchInput(di: TouchInput) {
    const radianX = (di.touchInput.pan.deltaX / di.el.clientWidth) * Math.PI * 2
    const radianY =
      -(di.touchInput.pan.deltaY / di.el.clientHeight) * Math.PI * 2
    this.alpha += radianX
    this.beta += radianY
    // and here
  }
}
