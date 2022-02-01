// import { createSprite } from '../sprite'
import { createBorder } from '../border'
import { Composite, Bodies, Body } from 'matter-js'
import { refs } from '../refs'
import { mat4 } from 'gl-matrix'

export const createGround = async () => {
  // const body = Bodies.rectangle(0, -50, 800, 100, { isStatic: true })

  // const border = refs.debug
  //   ? await createBorder({
  //       position: [0, -50, -6],
  //       size: [800, 100]
  //     })
  //   : null

  // Composite.add(refs.engine.world, body)

  const blockLength = 5
  const blocks = await Promise.all(
    new Array(5).fill(0).map(async (_, i) => {
      const x = i * blockLength * 80 - 100
      const y = -50
      const width = blockLength * 50
      const height = 100
      const body = Bodies.rectangle(x, y, width, height, { isStatic: true, friction: 0.5 })

      Composite.add(refs.engine.world, body)

      const border = refs.debug
        ? await createBorder({
            position: [x, y, -6],
            size: [width, height]
          })
        : null
      return { body, border }
    })
  )

  return {
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      blocks.forEach(({ body, border }) => {
        // const deltaX = refs.deltaT * 0.005
        // body.position.x -= deltaX
        if (body.position.x < -800) {
          Body.translate(body, { x: 1600, y: 0 })
        } else {
          Body.translate(body, { x: -1, y: 0 })
        }
        if (refs.debug) {
          border!.position[0] = body.position.x
          border!.render({ modelMatrix, viewProjection })
        }
      })
      // if (refs.debug) {
      //   border!.render({ modelMatrix, viewProjection })
      // }
    }
  }
}
