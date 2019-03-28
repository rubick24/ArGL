import { vec3, mat4, glMatrix } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'
import TouchInput from '../input/TouchInput'

export default class ArcRotateCamre {
  public axis = vec3.create()
  public rotationMatrix = mat4.identity(mat4.create())
  public viewMaxtrix = mat4.create()
  private _position = vec3.create()
  // private _alpha: number
  // private _beta: number
  // private _radius: number

  constructor(
    public target: vec3,
    public alpha: number,
    public beta: number,
    public radius: number
  ) {
    this.updateViewMatrix()
    return new Proxy(this, {
      set: (t, key, value, receiver) => {
        const result = Reflect.set(t, key, value, receiver)
        const observable = ['alpha', 'beta', 'radius']
        if (observable.some(v => v === key)) {
          t.updateViewMatrix()
        }
        return result
      }
    })
  }

  public get position() {
    return this._position
  }

  public get up() {
    const m = this.rotationMatrix
    return vec3.fromValues(m[1], m[5], m[9])
  }

  public updateViewMatrix() {
    const cosa = Math.cos(this.alpha)
    const sina = Math.sin(this.alpha)
    const cosb = Math.cos(this.beta)
    const sinb = Math.sin(this.beta) !== 0 ? Math.sin(this.beta) : 0.0001

    const up = vec3.fromValues(0, 1, 0)
    if (!vec3.equals(this.up, up)) {
      this.axis = vec3.cross(vec3.create(), up, this.up)
      vec3.normalize(this.axis, this.axis)
      const angle = Math.acos(vec3.dot(up, this.axis))
      this.rotationMatrix = mat4.fromRotation(mat4.create(), angle, this.axis)
    }
    const trans = vec3.fromValues(
      this.radius * cosa * sinb,
      this.radius * cosb,
      this.radius * sina * sinb
    )
    vec3.normalize(this.axis, trans)
    vec3.transformMat4(trans, trans, this.rotationMatrix)
    // vec3.add(this._position, this._position, trans)
    this._position = trans
    mat4.lookAt(this.viewMaxtrix, this.position, this.target, this.up)
  }

  public getViewMatrix() {
    return this.viewMaxtrix
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
