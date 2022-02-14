import { createSpriteMap } from '../sprite'
import { Composite, Bodies, Body } from 'matter-js'
import { refs } from '../refs'
import { mat4 } from 'gl-matrix'

export const createGround = async () => {
  const blockLength = 7
  const spaceWidth = 320
  const blockWidth = 160
  const blocks = new Array(blockLength).fill(0).map((_, i) => {
    const x = i * spaceWidth + 100
    const y = -150 + Math.floor(Math.random() * 100)
    const width = blockWidth
    const height = 96
    return { x, y, width, height }
  })

  const bodies = await Promise.all(
    blocks.map(async v => {
      const body = Bodies.rectangle(v.x, v.y, v.width, v.height, {
        isStatic: true,
        friction: 0.5,
        frictionAir: 0.6,
        label: 'ground',
        collisionFilter: {
          category: 2,
          mask: 0b1111
        }
      })
      Composite.add(refs.engine.world, body)
      return body
    })
  )

  const sprites = await Promise.all(
    blocks.map(async v =>
      createSpriteMap({
        texture: 'sprite/cavesofgallet_tiles.png',
        atlas: 'sprite/cavesofgallet_tiles_hash.json',
        tileSize: [8, 8],
        scale: [4, 4],
        gridData: [
          {
            position: [0, 0],
            tile: 'cave_tiles_0.ase'
          },
          {
            position: [1, 0],
            tile: 'cave_tiles_0.ase'
          },
          {
            position: [-1, 0],
            tile: 'cave_tiles_2.ase'
          },
          {
            position: [2, 0],
            tile: 'cave_tiles_43.ase',
            flip: 1
          },
          {
            position: [-2, 0],
            tile: 'cave_tiles_43.ase'
          },
          {
            position: [0, 1],
            tile: 'cave_tiles_36.ase'
          },
          {
            position: [1, 1],
            tile: 'cave_tiles_36.ase'
          },
          {
            position: [2, 1],
            tile: 'cave_tiles_35.ase',
            flip: 1
          },
          {
            position: [-1, 1],
            tile: 'cave_tiles_36.ase'
          },
          {
            position: [-2, 1],
            tile: 'cave_tiles_35.ase'
          },
          {
            position: [0, -1],
            tile: 'cave_tiles_52.ase'
          },
          {
            position: [1, -1],
            tile: 'cave_tiles_52.ase'
          },
          {
            position: [-1, -1],
            tile: 'cave_tiles_52.ase'
          },
          {
            position: [2, -1],
            tile: 'cave_tiles_51.ase',
            flip: 1
          },
          {
            position: [-2, -1],
            tile: 'cave_tiles_51.ase'
          }
        ],
        position: [v.x, v.y, -5]
      })
    )
  )

  return {
    blocks,
    bodies,
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      bodies.forEach((body, i) => {
        // const deltaX = refs.deltaT * 0.005
        // body.position.x -= deltaX
        if (body.position.x < -(spaceWidth * blockLength) / 2) {
          if (!body.isStatic) {
            Body.setStatic(body, true)
            Body.setVelocity(body, { x: 0, y: 0 })
          }
          Body.setPosition(body, {
            x: (spaceWidth * blockLength) / 2,
            y: -150 + Math.random() * 100
          })
          // Body.translate(body, { x: spaceWidth * blockLength, y: 0 })
        }
        // spriteMap.render({ modelMatrix, viewProjection })
        sprites[i].position[0] = body.position.x
        sprites[i].position[1] = body.position.y
        sprites[i].render({ modelMatrix, viewProjection })

        // if (refs.debug) {
        //   borders![i].position[0] = body.position.x
        //   borders![i].render({ modelMatrix, viewProjection })
        // }
      })
    }
  }
}
