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
  const blocks = new Array(5).fill(0).map((_, i) => {
    const x = i * blockLength * 80 - 200
    const y = -150 + Math.random() * 150
    const width = blockLength * 50
    const height = 100
    return { x, y, width, height }
  })

  const bodies = await Promise.all(
    blocks.map(async v => {
      const body = Bodies.rectangle(v.x, v.y, v.width, v.height, { isStatic: true, friction: 0.5 })
      Composite.add(refs.engine.world, body)
      return body
    })
  )
  const borders = refs.debug
    ? await Promise.all(
        blocks.map(v =>
          createBorder({
            position: [v.x, v.y, -6],
            size: [v.width, v.height]
          })
        )
      )
    : null

  return {
    blocks,
    bodies,
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      bodies.forEach((body, i) => {
        // const deltaX = refs.deltaT * 0.005
        // body.position.x -= deltaX
        if (body.position.x < -800) {
          Body.translate(body, { x: 1600, y: 0 })
        } else {
          // Body.translate(body, { x: -3, y: 0 })
        }
        if (refs.debug) {
          borders![i].position[0] = body.position.x
          borders![i].render({ modelMatrix, viewProjection })
        }
      })
      // if (refs.debug) {
      //   border!.render({ modelMatrix, viewProjection })
      // }
    }
  }
}
