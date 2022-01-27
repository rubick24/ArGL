import UniversalCamera from '../camera/UniversalCamera'
// import ArcRotateCamera from '../camera/ArcRotateCamera'
import { DesktopInput } from '../input/DesktopInput'

import { vec3, mat4 } from 'gl-matrix'
import { Engine, Composite, Bodies, Body, Events } from 'matter-js'

import { animated_sprite } from '../sprite_animation'
import axis from '../axis/axis'
import { createBorder } from '../border'
import { createBackground } from './bg'

export const createScene = async (gl: WebGL2RenderingContext) => {
  const camera = new UniversalCamera(vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, -1))
  // const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 1000)

  const playerSprite = await animated_sprite(gl, {
    texture: 'sprite/player-compat.png',
    atlas: 'sprite/player-compat.json',
    scale: [2, 2]
  })
  const bg = await createBackground(gl)
  const border = await createBorder(gl, {
    position: [0, 0, -6],
    size: [10, 10]
  })

  const drawAxis = await axis(gl)
  const di = DesktopInput.getInstance(gl.canvas)

  playerSprite.setAnimation('run')

  const engine = Engine.create()
  // engine.enableSleeping = true
  engine.gravity.y = -1
  const ground = Bodies.rectangle(0, -50, 800, 100, { isStatic: true })
  const playerRect = Bodies.rectangle(-200, 300, 100, 100, { inertia: Infinity })
  Composite.add(engine.world, [ground, playerRect])

  const canvas = gl.canvas
  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.001, 1e10)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.01, 1000)
  }
  let projectionMatrix = getProjection()

  const model = mat4.create()
  const viewProjection = mat4.create()

  let grounded = false
  window.addEventListener('keydown', e => {
    const m: Record<string, () => void> = {
      w: () => {
        if (grounded) {
          Body.applyForce(playerRect, playerRect.position, { x: 0, y: 1 })
        }
      }
    }
    m[e.key]?.()
  })
  Events.on(engine, 'collisionStart', () => {
    playerSprite.setAnimation('run')
    grounded = true
  })
  Events.on(engine, 'collisionEnd', () => {
    playerSprite.setAnimation('jump_rise')
    grounded = false
  })

  let dt = 0
  let last = performance.now()
  const render = (time: number) => {
    dt = last - time
    last = time
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      gl.viewport(0, 0, canvas.width, canvas.height)
      projectionMatrix = getProjection()
    }

    if (playerSprite.currentAnimation === 'jump_rise' && playerRect.velocity.y < 1) {
      playerSprite.setAnimation('jump_mid')
    } else if (playerSprite.currentAnimation === 'jump_mid' && playerRect.velocity.y < -1) {
      playerSprite.setAnimation('jump_fall')
    }

    // control
    const force = grounded ? 0.5 : 0.2
    const keyLeft = di.currentlyPressedKeys.get('ArrowLeft')
    const keyRight = di.currentlyPressedKeys.get('ArrowRight')
    if (!keyLeft && keyRight) {
      playerSprite.scale[0] = 2
      if (playerRect.velocity.x < 3) {
        Body.applyForce(playerRect, playerRect.position, { x: force, y: 0 })
      }
    } else if (keyLeft && !keyRight) {
      playerSprite.scale[0] = -2
      if (playerRect.velocity.x > -3) {
        Body.applyForce(playerRect, playerRect.position, { x: -force, y: 0 })
      }
    }

    Engine.update(engine, dt)

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)
    drawAxis({ viewProjection })
    // camera.processDesktopInput(di)

    bg.render({
      modelMatrix: model,
      viewProjection,
      dt
    })

    const centerOffset = [
      playerSprite.sourceSize.w / 2 -
        playerSprite.spriteSourceSize.x -
        playerSprite.spriteSourceSize.w / 2,
      playerSprite.sourceSize.h / 2 -
        playerSprite.spriteSourceSize.y -
        playerSprite.spriteSourceSize.h / 2
    ]
    // console.log(centerOffset)
    border.position = [
      playerRect.position.x + centerOffset[0] * 2,
      playerRect.position.y + centerOffset[1] * 2,
      border.position[2]
    ]
    Body.set(playerRect, {
      size: [],
    })
    // Body.scale(playerRect, 2, 2)
    // playerRect
    // console.log(playerRect.bounds.min, playerRect.bounds.max)
    // border.size = [playerSprite.spriteSourceSize.w * 2, playerSprite.spriteSourceSize.h * 2]
    border.render({ modelMatrix: model, viewProjection })

    playerSprite.position = [playerRect.position.x, playerRect.position.y, 0]
    playerSprite.render({
      modelMatrix: model,
      viewProjection,
      time
    })
  }
  return {
    camera,
    render
  }
}
