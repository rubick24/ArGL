import { createSprite } from '../sprite'
import { mat4 } from 'gl-matrix'
import { refs } from '../refs'
export const createBackground = async () => {
  const sky = await createSprite({
    texture: 'sprite/bg/sky.png',
    scale: [2, 2],
    repeat: [6, 1],
    position: [0, 152, -10]
  })

  const clouds = await createSprite({
    texture: 'sprite/bg/clouds.png',
    scale: [2, 2],
    repeat: [1.235, 1],
    position: [0, 80, -9]
  })

  const sea = await createSprite({
    texture: 'sprite/bg/sea.png',
    scale: [2, 2],
    repeat: [6, 1],
    position: [0, -96, -8]
  })

  const farGround = await createSprite({
    texture: 'sprite/bg/far-grounds.png',
    position: [0, -82, -7],
    scale: [2, 2]
  })

  // const temp = mat4.create()

  const entities = [sky, clouds, sea, farGround]

  return {
    render: ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
      clouds.uvOffset[0] = (clouds.uvOffset[0] + refs.deltaT * 0.00002) % 1
      sea.uvOffset[0] = (sea.uvOffset[0] + refs.deltaT * 0.0001) % 1

      // farGround.uvOffset[0] = (farGround.uvOffset[0] - dt * 0.0008) % 1ß
      entities.forEach(v => v.render({ modelMatrix, viewProjection }))
    }
  }
}
