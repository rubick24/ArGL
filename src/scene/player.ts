import { createAnimatedSprite } from '../sprite'
// import { createBorder } from '../border'
import { mat4 } from 'gl-matrix'
import { Bodies, Body, Composite } from 'matter-js'
import { refs } from '../refs'

export const createPlayer = async () => {
  const sprite = await createAnimatedSprite({
    texture: 'sprite/player-compat.png',
    atlas: 'sprite/player-compat.json',
    scale: [2, 2]
  })

  const position = { x: 50, y: 200 }
  const size = { x: 40, y: 78 }

  const body = Bodies.rectangle(position.x, position.y, size.x, size.y, {
    inertia: Infinity,
    label: 'player'
  })
  Body.setMass(body, 10)
  Body.setVelocity(body, { x: 0, y: 0 })

  let grounded = false
  Composite.add(refs.engine.world, body)

  window.addEventListener('keydown', e => {
    const m: Record<string, () => void> = {
      ' ': () => {
        if (grounded) {
          Body.applyForce(body, body.position, { x: 0, y: 0.4 })
        }
      }
    }
    m[e.key]?.()
  })

  sprite.setAnimation('jump_fall')

  // const border = refs.debug
  //   ? await createBorder({
  //       position: [position.x, position.y, 0],
  //       size: [size.x, size.y]
  //     })
  //   : null

  const render = ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
    // control
    const force = grounded ? 0.1 : 0.01
    // const vel = grounded ? 4 : 3
    const keyLeft = refs.di!.currentlyPressedKeys.get('ArrowLeft')
    const keyRight = refs.di!.currentlyPressedKeys.get('ArrowRight')
    if (!keyLeft && keyRight) {
      sprite.scale[0] = 2
      if (body.velocity.x < 3) {
        // Body.setVelocity(body, { x: vel, y: body.velocity.y })
        Body.applyForce(body, body.position, { x: force, y: 0 })
      }
    } else if (keyLeft && !keyRight) {
      sprite.scale[0] = -2
      if (body.velocity.x > -3) {
        // Body.setVelocity(body, { x: -vel, y: body.velocity.y })
        Body.applyForce(body, body.position, { x: -force, y: 0 })
      }
    }

    if (grounded) {
      if (sprite.currentAnimation !== 'run' && (keyLeft || keyRight)) {
        sprite.setAnimation('run')
      } else if (sprite.currentAnimation === 'run' && !(keyLeft || keyRight)) {
        sprite.setAnimation('idle')
      }
    } else {
      if (sprite.currentAnimation === 'jump_rise' && body.velocity.y < 1) {
        sprite.setAnimation('jump_mid')
      } else if (sprite.currentAnimation === 'jump_mid' && body.velocity.y < -1) {
        sprite.setAnimation('jump_fall')
      }
    }

    // sync position
    // if (refs.debug) {
    //   border!.position = [body.position.x, body.position.y, border!.position[2]]
    // }
    sprite.position = [body.position.x, body.position.y + 45, sprite.position[2]]

    // render
    // if (refs.debug) {
    //   border!.render({ modelMatrix, viewProjection })
    // }
    sprite.render({
      modelMatrix,
      viewProjection
    })
  }

  return {
    get position() {
      return body.position
    },
    set position(v) {
      Body.setPosition(body, v)
      Body.setVelocity(body, { x: 0, y: 0 })
      sprite.position = [v.x, v.y + 45, 0]
      // if (refs.debug) {
      //   border!.position = [v.x, v.y, border!.position[2]]
      // }
    },
    get size() {
      return size
    },
    get grounded() {
      return grounded
    },
    set grounded(v) {
      if (v) {
        sprite.setAnimation('land', 1)
        sprite.pushAnimation('idle')
        grounded = true
      } else {
        sprite.setAnimation('jump_rise')
        grounded = false
      }
    },

    sprite,
    body,
    render
  }
}
