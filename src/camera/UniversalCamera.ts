import { vec3, mat4 } from 'gl-matrix'
// import DesktopInput from '../input/DesktopInput'
// import TouchInput from '../input/TouchInput'

export type UniversalCamera = {
  position: vec3
  direction: vec3
  up: vec3
  fovY: number
  readonly viewMatrix: mat4
  getProjectionMatrix(aspect: number, near: number, far: number): mat4
  getOrthographicProjectionMatrix(width: number, height: number, near: number, far: number): mat4
}

export const createCamera = (options: {
  position: vec3
  direction: vec3
  up?: vec3
  fovY?: number
}): UniversalCamera => {
  let { position, direction } = options
  let up = options.up || vec3.fromValues(0, 1, 0)
  let fovY = options.fovY || Math.PI / 4

  // const rotationMatrix: mat4 = mat4.create()
  const viewMatrix: mat4 = mat4.create()
  const tempMat4: mat4 = mat4.create()
  const tempDir: vec3 = vec3.create()

  const checkLimit = () => {}
  const updateViewMatrix = () => {
    vec3.add(tempDir, position, direction)
    mat4.lookAt(viewMatrix, position, tempDir, up)
  }
  updateViewMatrix()

  const r = {}

  Object.defineProperties(r, {
    position: {
      get() {
        return position
      },
      set(v) {
        position = v
        checkLimit()
        updateViewMatrix()
      }
    },
    direction: {
      get() {
        return direction
      },
      set(v) {
        direction = v
        checkLimit()
        updateViewMatrix()
      }
    },
    up: {
      get() {
        return up
      },
      set(v) {
        up = v
        checkLimit()
        updateViewMatrix()
      }
    }
  })
  return {
    get position() {
      return position
    },
    set position(v) {
      position = v
      checkLimit()
      updateViewMatrix()
    },
    get direction() {
      return direction
    },
    set direction(v) {
      direction = v
      checkLimit()
      updateViewMatrix()
    },
    get up() {
      return up
    },
    set up(v) {
      up = v
      checkLimit()
      updateViewMatrix()
    },
    get fovY() {
      return fovY
    },
    set fovY(v) {
      fovY = v
    },
    get viewMatrix() {
      return viewMatrix
    }, // get
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
    }
  }
}

// public processDesktopInput(di: DesktopInput) {
//   //
//   if (!di.mouseInput.dragging) {
//     return
//   }
//   const deltaX = di.mouseInput.x - di.mouseInput.lastX
//   const deltaY = di.mouseInput.y - di.mouseInput.lastY
//   let update = false
//   if (Math.abs(deltaX) > 1e-6) {
//     this.position[0] += deltaX / 1000
//     update = true
//   }
//   if (Math.abs(deltaY) > 1e-6) {
//     this.position[1] += -deltaY / 1000
//     update = true
//   }
//   if (update) {
//     this.updateViewMatrix()
//   }
// }
