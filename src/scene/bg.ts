import { createSprite } from '../sprite'
import { mat4 } from 'gl-matrix'
import { refs } from '../refs'
export const createBackground = async () => {
  const sky = await createSprite({
    texture: 'sprite/bg/sky.png',
    scale: [3, 3],
    repeat: [6, 1],
    position: [0, 152, -10]
  })

  const clouds = await createSprite({
    texture: 'sprite/bg/clouds.png',
    scale: [3, 3],
    repeat: [1.235, 1],
    position: [0, 80, -9]
  })

  const sea = await createSprite({
    texture: 'sprite/bg/sea.png',
    scale: [3, 3],
    repeat: [6, 1],
    position: [0, -96, -8]
  })

  // const farGround = await createSprite({
  //   texture: 'sprite/bg/far-grounds.png',
  //   scale: [3, 3],
  //   position: [0, -82, -7]
  // })

  // const temp = mat4.create()

  const entities = [sky, clouds, sea]

  return {
    render: ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
      clouds.uvOffset[0] = (clouds.uvOffset[0] + refs.deltaT * 0.00001) % 1
      sea.uvOffset[0] = (sea.uvOffset[0] + refs.deltaT * 0.0002) % 1
      entities.forEach(v => v.render({ modelMatrix, viewProjection }))
    }
  }
}
