import { vec3, mat4 } from 'gl-matrix'
import DesktopInput from '../input/DesktopInput'
// import TouchInput from '../input/TouchInput'

export default class UniversalCamera {
  public rotationMatrix: mat4 = mat4.identity(mat4.create())

  private _viewMaxtrix: mat4 = mat4.create()
  private _tempMat4: mat4 = mat4.create()
  private _tempDir: vec3 = vec3.create()

  constructor(
    public position: vec3,
    public direction: vec3,
    public up = vec3.fromValues(0, 1, 0),
    public fovy = Math.PI / 4
  ) {
    this.updateViewMatrix()
    return new Proxy(this, {
      set: (t, key, value, receiver) => {
        const result = Reflect.set(t, key, value, receiver)
        const observable: (string | number | symbol)[] = ['position', 'direction', 'up']
        if (observable.includes(key)) {
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

  public _checkLimit() {
    //
  }

  public updateViewMatrix() {
    vec3.add(this._tempDir, this.position, this.direction)
    mat4.lookAt(this._viewMaxtrix, this.position, this._tempDir, this.up)
  }

  public getProjectionMatrix(aspect: number, near: number, far: number): mat4 {
    return mat4.perspective(this._tempMat4, this.fovy, aspect, near, far)
  }
  public getorthographicProjectionMatrix(
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
    //
    if (!di.mouseInput.dragging) {
      return
    }
    const deltaX = di.mouseInput.x - di.mouseInput.lastX
    const deltaY = di.mouseInput.y - di.mouseInput.lastY
    let update = false
    if (Math.abs(deltaX) > 1e-6) {
      this.position[0] += (deltaX / 1000)
      update = true
    }
    if (Math.abs(deltaY) > 1e-6) {
      this.position[1] += (-deltaY / 1000)
      update = true
    }
    if (update) {
      this.updateViewMatrix()
    }
  }
}
