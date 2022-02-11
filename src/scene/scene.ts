import { createCamera } from '../camera/UniversalCamera'
// import { createCamera } from '../camera/ArcRotateCamera'

import { vec3, mat4 } from 'gl-matrix'
import { Engine, Query, Composite, Events } from 'matter-js'

// import axis from '../axis/axis'
import { createBackground } from './bg'
import { refs, GameStage, changeStage } from '../refs'
import { createPlayer } from './player'
import { createGround } from './ground'
import { createCoin } from './coin'

export const createScene = async () => {
  const { canvas, gl, engine } = refs
  // engine.enableSleeping = true
  engine.gravity.y = -1

  const camera = createCamera({
    position: vec3.fromValues(0, 0, 3),
    direction: vec3.fromValues(0, 0, -1)
  })
  // const camera = createCamera({
  //   target: vec3.fromValues(0, 0, 0),
  //   alpha: Math.PI / 2,
  //   beta: Math.PI / 2,
  //   radius: 1000
  // })

  // const drawAxis = await axis()
  const bg = await createBackground()
  const player = await createPlayer()
  const ground = await createGround()
  const coin = await createCoin()

  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.001, 1e10)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.01, 1000)
  }
  let projectionMatrix = getProjection()

  const modelMatrix = mat4.create()
  const viewProjection = mat4.create()

  refs.transformMap.leave[GameStage.MainMenu].push(() => {
    refs.gameState.duration = 0
    refs.gameState.score = 0
    player.position = { x: 50, y: 200 }
    Engine.update(engine, 0)
  })

  const render = () => {
    // if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
    //   canvas.height = window.innerHeight
    //   canvas.width = window.innerWidth
    //   gl.viewport(0, 0, canvas.width, canvas.height)
    //   projectionMatrix = getProjection()
    // }

    Composite.translate(engine.world, { x: -0.1 * refs.deltaT, y: 0 })
    const collision = Query.ray(
      ground.bodies,
      player.position,
      {
        x: player.position.x,
        y: player.position.y - player.size.y / 2 - 5
      },
      player.size.x - 5
    )
    if (collision.length > 0 && !player.grounded) {
      player.grounded = true
    } else if (collision.length === 0 && player.grounded) {
      player.grounded = false
    }

    // Events.on(engine, 'collisionStart', event => {
    //   console.log(event.pairs[0].bodyA.label, event.pairs[0].bodyB.label)
    // })

    if (player.position.x < -960 || player.position.y < -180) {
      changeStage(GameStage.MainMenu)
    }

    Engine.update(engine, refs.deltaT)

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)
    // drawAxis({ viewProjection })
    // camera.processDesktopInput(di)

    bg.render({
      modelMatrix,
      viewProjection
    })
    ground.render({ modelMatrix, viewProjection })
    coin.render({ modelMatrix, viewProjection })
    player.render({ modelMatrix, viewProjection })
  }
  return {
    camera,
    render
  }
}
