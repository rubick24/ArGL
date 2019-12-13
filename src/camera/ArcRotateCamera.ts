import { vec3, mat4, glMatrix } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'
// import TouchInput from '../input/TouchInput'

const up = vec3.fromValues(0, 1, 0)

export default class ArcRotateCamera {
  public rotationMatrix: Float32Array = mat4.identity(mat4.create())
  public maxAlphaLimit = Math.PI * 2
  public minAlphaLimit = -Math.PI * 2
  public maxBetaLimit = Math.PI
  public minBetaLimit = 0

  private _viewMaxtrix: Float32Array = mat4.create()
  private _position: Float32Array = vec3.create()
  private _tempMat4: Float32Array = mat4.create()
  private _tempAxis: Float32Array = vec3.create()
  private _tempUp: Float32Array = vec3.create()

  constructor(
    public target: Float32Array,
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
  }

  public updateViewMatrix() {
    const cosa = Math.cos(this.alpha)
    const sina = Math.sin(this.alpha)
    const cosb = Math.cos(this.beta)
    const sinb = Math.sin(this.beta) !== 0 ? Math.sin(this.beta) : 0.0001

    if (!vec3.equals(this.up, up)) {
      vec3.cross(this._tempAxis, up, this.up)
      vec3.normalize(this._tempAxis, this._tempAxis)
      const angle = Math.acos(vec3.dot(up, this._tempAxis))
      mat4.fromRotation(this.rotationMatrix, angle, this._tempAxis)
    }
    const trans = vec3.fromValues(
      this.radius * cosa * sinb,
      this.radius * cosb,
      this.radius * sina * sinb
    )
    // vec3.normalize(trans, trans)
    vec3.transformMat4(trans, trans, this.rotationMatrix)
    vec3.add(this._position, this.target, trans)
    mat4.lookAt(this._viewMaxtrix, this.position, this.target, this.up)
  }

  public getProjectionMatrix(aspect: number, near: number, far: number): Float32Array {
    // return mat4.ortho(this._tempMat4, -aspect*3, aspect*3, -3, 3, near, far) 
    return mat4.perspective(
      this._tempMat4,
      glMatrix.toRadian(45),
      aspect,
      near,
      far
    )
  }

  public processDesktopInput(di: DesktopInput) {
    if (di.mouseInput.draging) {
      const deltaX = di.mouseInput.x - di.mouseInput.lastX
      const deltaY = di.mouseInput.y - di.mouseInput.lastY
      const radianX = (deltaX / di.el.clientWidth) * Math.PI * 2
      const radianY = -(deltaY / di.el.clientHeight) * Math.PI * 2
      this.alpha += radianX
      this.beta += radianY
    }
    // process zoom here
    // di.mouseInput.wheel
  }

  // public processTouchInput(di: TouchInput) {
  //   const radianX = (di.touchInput.pan.deltaX / di.el.clientWidth) * Math.PI * 2
  //   const radianY =
  //     -(di.touchInput.pan.deltaY / di.el.clientHeight) * Math.PI * 2
  //   this.alpha += radianX
  //   this.beta += radianY
  //   // and here
  // }
}
