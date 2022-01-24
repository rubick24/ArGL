import { sprite } from '../sprite'
import { mat4 } from 'gl-matrix'
export const createBackground = async (gl: WebGL2RenderingContext) => {
  const sky = await sprite(gl, {
    texture: 'sprite/bg/sky.png',
    scale: 2
  })

  const clouds = await sprite(gl, {
    texture: 'sprite/bg/clouds.png',
    scale: 2
  })

  const farGround = await sprite(gl, {
    texture: 'sprite/bg/far-grounds.png',
    scale: 2
  })

  const temp = mat4.create()

  return {
    render: ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
      mat4.translate(temp, modelMatrix, [0, 0, -10])
      sky.render({ modelMatrix: temp, viewProjection })

      mat4.translate(temp, modelMatrix, [0, 0, -9])
      clouds.render({ modelMatrix: temp, viewProjection })

      mat4.translate(temp, modelMatrix, [0, 0, -8])
      farGround.render({ modelMatrix: temp, viewProjection })
    }
  }
}
