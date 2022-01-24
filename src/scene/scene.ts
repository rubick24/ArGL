import UniversalCamera from '../camera/UniversalCamera'
import ArcRotateCamera from '../camera/ArcRotateCamera'
import { DesktopInput } from '../input/DesktopInput'

import { vec3, mat4 } from 'gl-matrix'
import { animated_sprite } from '../animated_sprite'
import axis from '../axis/axis'
import { createBackground } from './bg'

export const createScene = async (gl: WebGL2RenderingContext) => {
  const camera = new UniversalCamera(vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, -1))
  // const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 1000)

  const scale = 3
  const playerSprite = await animated_sprite(gl, {
    texture: 'sprite/player-compat.png',
    atlas: 'sprite/player-compat.json',
    scale
  })
  const bg = await createBackground(gl)

  const drawAxis = await axis(gl)
  const di = DesktopInput.getInstance(gl.canvas)

  playerSprite.setAnimation('run')

  const modelMatrix = mat4.create()

  const canvas = gl.canvas
  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.001, 1e10)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.01, 1000)
  }
  let projectionMatrix = getProjection()
  mat4.translate(modelMatrix, modelMatrix, [0, scale * 42, 0])

  const temp = mat4.create()
  const viewProjection = mat4.create()

  const render = (time: number, world?: mat4) => {
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      gl.viewport(0, 0, canvas.width, canvas.height)
      projectionMatrix = getProjection()
    }

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)

    drawAxis({ viewProjection })
    if (world) {
      mat4.mul(temp, world, modelMatrix)
    } else {
      mat4.copy(temp, modelMatrix)
    }

    // camera.processDesktopInput(di)

    bg.render({
      modelMatrix: temp,
      viewProjection
    })
    playerSprite.render({
      modelMatrix: temp,
      viewProjection,
      time
    })
  }
  return {
    camera,
    render
  }
}
