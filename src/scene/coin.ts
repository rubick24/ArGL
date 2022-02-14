import { createSpriteMap } from '../sprite'
import { Composite, Bodies, Body, Composites, Query, Events } from 'matter-js'
import { mat4 } from 'gl-matrix'
import { refs } from '../refs'

export const createCoin = async () => {
  const sprite = await createSpriteMap({
    texture: 'sprite/cavesofgallet_tiles.png',
    atlas: 'sprite/cavesofgallet_tiles_hash.json',
    tileSize: [8, 8],
    scale: [4, 4],
    gridData: [
      {
        position: [0, 0],
        tile: 'cave_tiles_39.ase'
      }
    ],
    position: [500, 100, -5]
  })

  const body = Bodies.rectangle(500, 100, 32, 32, { isStatic: true, isSensor: true, label: 'coin' })
  Composite.add(refs.engine.world, body)

  return {
    body,
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      sprite.position[0] = body.position.x
      sprite.position[1] = body.position.y
      sprite.render({ modelMatrix, viewProjection })
    },
    get position() {
      return body.position
    },
    set position(v) {
      Body.setPosition(body, v)
    }
  }
}
