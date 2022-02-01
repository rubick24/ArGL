import { createAnimatedSprite } from '../sprite_animation'
import { createBorder } from '../border'
import { mat4 } from 'gl-matrix'
import { Bodies, Body, Events, Composite } from 'matter-js'
import { refs } from '../refs'

export const createPlayer = async () => {
  const sprite = await createAnimatedSprite({
    texture: 'sprite/player-compat.png',
    atlas: 'sprite/player-compat.json',
    scale: [2, 2]
  })

  const bodyX = -200
  const bodyY = 200
  const bodyWidth = 40
  const bodyHeight = 78

  const body = Bodies.rectangle(bodyX, bodyY, bodyWidth, bodyHeight, { inertia: Infinity })
  Body.setMass(body, 10)
  Body.setVelocity(body, { x: 0, y: 0 })

  const state = {
    grounded: false
  }
  Composite.add(refs.engine.world, body)

  window.addEventListener('keydown', e => {
    const m: Record<string, () => void> = {
      ' ': () => {
        if (state.grounded) {
          Body.applyForce(body, body.position, { x: 0, y: 0.25 })
        }
      }
    }
    m[e.key]?.()
  })

  Events.on(refs.engine, 'collisionStart', e => {
    console.log(e.pairs.length, e.pairs[0])
    sprite.setAnimation('land', 1)
    sprite.pushAnimation('idle')
    state.grounded = true
  })
  Events.on(refs.engine, 'collisionEnd', () => {
    sprite.setAnimation('jump_rise')
    state.grounded = false
  })

  sprite.setAnimation('idle')

  const border = refs.debug
    ? await createBorder({
        position: [bodyX, bodyY, -6],
        size: [bodyWidth, bodyHeight]
      })
    : null

  return {
    setPosition(position: [number, number]) {
      body.position.x = position[0]
      body.position.y = position[1]
      sprite.position = [position[0], position[1] + 45, 0]
      if (refs.debug) {
        border!.position = [position[0], position[1], border!.position[2]]
      }
    },
    sprite,
    body,
    border,
    state,
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      // sync position
      if (refs.debug) {
        border!.position = [body.position.x, body.position.y, border!.position[2]]
      }
      sprite.position = [body.position.x, body.position.y + 45, sprite.position[2]]

      if (state.grounded) {
        Body.translate(body, { x: -1, y: 0 })
      }

      // control
      const force = state.grounded ? 0.1 : 0.05
      const keyLeft = refs.di!.currentlyPressedKeys.get('ArrowLeft')
      const keyRight = refs.di!.currentlyPressedKeys.get('ArrowRight')
      if (!keyLeft && keyRight) {
        sprite.scale[0] = 2
        if (body.velocity.x < 3) {
          Body.applyForce(body, body.position, { x: force, y: 0 })
        }
      } else if (keyLeft && !keyRight) {
        sprite.scale[0] = -2
        if (body.velocity.x > -3) {
          Body.applyForce(body, body.position, { x: -force, y: 0 })
        }
      }

      if (state.grounded) {
        if (sprite.currentAnimation !== 'run' && (keyLeft || keyRight)) {
          sprite.setAnimation('run')
        } else if (sprite.currentAnimation !== 'idle' && !(keyLeft || keyRight)) {
          sprite.setAnimation('idle')
        }
      } else {
        if (sprite.currentAnimation === 'jump_rise' && body.velocity.y < 1) {
          sprite.setAnimation('jump_mid')
        } else if (sprite.currentAnimation === 'jump_mid' && body.velocity.y < -1) {
          sprite.setAnimation('jump_fall')
        }
      }

      // render
      if (refs.debug) {
        border!.render({ modelMatrix, viewProjection })
      }
      sprite.render({
        modelMatrix,
        viewProjection
      })
    }
  }
}
