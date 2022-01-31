// import { createSprite } from '../sprite'
import { createBorder } from '../border'
import { Composite, Bodies } from 'matter-js'
import { refs } from '../refs'
import { mat4 } from 'gl-matrix'

export const createGround = async () => {
  const body = Bodies.rectangle(0, -50, 800, 100, { isStatic: true })

  const border = refs.debug
    ? await createBorder({
        position: [0, -50, -6],
        size: [800, 100]
      })
    : null

  Composite.add(refs.engine.world, body)

  return {
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      if (refs.debug) {
        border!.render({ modelMatrix, viewProjection })
      }
    }
  }
}
