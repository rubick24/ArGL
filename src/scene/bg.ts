import { sprite } from '../sprite'
import { mat4 } from 'gl-matrix'
export const createBackground = async (gl: WebGL2RenderingContext) => {
  const sky = await sprite(gl, {
    texture: 'sprite/bg/sky.png',
    scale: [2, 2],
    repeat: [6, 1],
    position: [0, 152, -10]
  })

  const clouds = await sprite(gl, {
    texture: 'sprite/bg/clouds.png',
    scale: [2, 2],
    repeat: [1.235, 1],
    position: [0, 80, -9]
  })

  const sea = await sprite(gl, {
    texture: 'sprite/bg/sea.png',
    scale: [2, 2],
    repeat: [6, 1],
    position: [0, -96, -8]
  })

  const farGround = await sprite(gl, {
    texture: 'sprite/bg/far-grounds.png',
    position: [0, -82, -7],
    scale: [2, 2]
  })

  const temp = mat4.create()

  return {
    render: ({
      modelMatrix,
      viewProjection,
      dt
    }: {
      modelMatrix: mat4
      viewProjection: mat4
      dt: number
    }) => {
      sky.render({ modelMatrix: temp, viewProjection })

      clouds.uvOffset[0] = (clouds.uvOffset[0] - dt * 0.00005) % 1
      clouds.render({ modelMatrix: temp, viewProjection })

      sea.uvOffset[0] = (sea.uvOffset[0] - dt * 0.0004) % 1
      sea.render({ modelMatrix: temp, viewProjection })

      // farGround.uvOffset[0] = (farGround.uvOffset[0] - dt * 0.0008) % 1
      farGround.render({ modelMatrix: temp, viewProjection })
    }
  }
}
