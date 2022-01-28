import UniversalCamera from '../camera/UniversalCamera'
// import ArcRotateCamera from '../camera/ArcRotateCamera'
import { DesktopInput } from '../input/DesktopInput'

import { vec3, mat4 } from 'gl-matrix'
import { Engine, Composite, Bodies, Body, Events } from 'matter-js'

// import { animated_sprite } from '../sprite_animation'
import axis from '../axis/axis'
import { createBorder } from '../border'
import { createBackground } from './bg'
import { refs } from '../refs'
import { createPlayer } from './player'

export const createScene = async () => {
  const gl = refs.gl!
  const canvas = gl.canvas
  refs.di = DesktopInput.getInstance(canvas)
  const engine = refs.engine
  // engine.enableSleeping = true
  engine.gravity.y = -1

  const camera = new UniversalCamera(vec3.fromValues(0, 0, 3), vec3.fromValues(0, 0, -1))
  // const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 1000)

  const drawAxis = await axis()
  const bg = await createBackground()
  const player = await createPlayer()
  const ground = Bodies.rectangle(0, -50, 800, 100, { isStatic: true })
  const groundBorder = await createBorder({
    position: [0, -50, -6],
    size: [800, 100]
  })

  Composite.add(engine.world, [ground, player.body])

  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.001, 1e10)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.01, 1000)
  }
  let projectionMatrix = getProjection()

  const model = mat4.create()
  const viewProjection = mat4.create()

  const render = () => {
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      gl.viewport(0, 0, canvas.width, canvas.height)
      projectionMatrix = getProjection()
    }

    Engine.update(engine, refs.deltaT)

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)
    drawAxis({ viewProjection })
    // camera.processDesktopInput(di)

    bg.render({
      modelMatrix: model,
      viewProjection
    })
    groundBorder.render({ modelMatrix: model, viewProjection })
    player.render({ modelMatrix: model, viewProjection })
  }
  return {
    camera,
    render
  }
}
