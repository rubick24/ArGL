import UniversalCamera from '../camera/UniversalCamera'
// import ArcRotateCamera from '../camera/ArcRotateCamera'
import { DesktopInput } from '../input/DesktopInput'

import { vec3, mat4 } from 'gl-matrix'
import { Engine, Composite, Bodies } from 'matter-js'

import { animated_sprite } from '../sprite_animation'
import axis from '../axis/axis'
import { createBackground } from './bg'

export const createScene = async (gl: WebGL2RenderingContext) => {
  const camera = new UniversalCamera(vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, -1))
  // const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 1000)

  const playerSprite = await animated_sprite(gl, {
    texture: 'sprite/player-compat.png',
    atlas: 'sprite/player-compat.json',
    scale: 2
  })
  const bg = await createBackground(gl)

  const drawAxis = await axis(gl)
  const di = DesktopInput.getInstance(gl.canvas)

  playerSprite.setAnimation('run')

  const engine = Engine.create()
  // engine.enableSleeping = true
  engine.gravity.y = -1
  const ground = Bodies.rectangle(0, -50, 800, 100, { isStatic: true })
  const playerRect = Bodies.rectangle(-200, 300, 96 * 2, 84 * 2, { inertia: Infinity })
  Composite.add(engine.world, [ground, playerRect])

  const canvas = gl.canvas
  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.001, 1e10)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.01, 1000)
  }
  let projectionMatrix = getProjection()

  const model = mat4.create()
  const temp = mat4.create()
  const viewProjection = mat4.create()

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

    Engine.update(engine, dt)

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)
    drawAxis({ viewProjection })
    // camera.processDesktopInput(di)

    bg.render({
      modelMatrix: model,
      viewProjection,
      dt
    })

    mat4.translate(temp, model, [playerRect.position.x, playerRect.position.y, 0])
    playerSprite.render({
      modelMatrix: temp,
      viewProjection,
      time
    })
  }
  return {
    camera,
    render
  }
}
