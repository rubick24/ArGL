import { createCamera } from '../camera/UniversalCamera'
// import { createCamera } from '../camera/ArcRotateCamera'

import { vec3, mat4 } from 'gl-matrix'
import { Engine, Composite, Events, Body } from 'matter-js'

// import axis from '../axis/axis'
import { createBackground } from './bg'
import { refs, GameStage, changeStage } from '../refs'
import { createPlayer } from './player'
import { createGround } from './ground'
import { createCoin } from './coin'

export const createScene = async () => {
  const { canvas, gl, engine } = refs
  engine.gravity.y = -1

  const camera = createCamera({
    position: vec3.fromValues(0, 0, 3),
    direction: vec3.fromValues(0, 0, -1)
  })
  // const camera = createCamera({
  //   target: vec3.fromValues(0, 0, 0),
  //   alpha: Math.PI / 2,
  //   beta: Math.PI / 2,
  //   radius: 500
  // })

  // const drawAxis = await axis()
  const bg = await createBackground()
  const player = await createPlayer()
  const ground = await createGround()
  const coin = await createCoin()

  const getProjection = () => {
    // return camera.getProjectionMatrix(canvas.width / canvas.height, 0.5, 1e4)
    return camera.getOrthographicProjectionMatrix(canvas.width, canvas.height, 0.1, 1000)
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

  Events.on(refs.engine, 'collisionStart', event => {
    // event.pairs.forEach(p => {
    //   console.log(p.bodyA.label, p.bodyB.label)
    // })

    const p = event.pairs.find(p => p.bodyA.label === 'player' && p.bodyB.label === 'ground')
    if (p && p.bodyB.isStatic) {
      Body.setStatic(p.bodyB, false)
    }

    // touch coin
    if (event.pairs.some(p => p.bodyA.label === 'player' && p.bodyB.label === 'coin')) {
      console.log('coin')
      coin.position = { x: 960 + 100 * Math.floor(Math.random() * 10), y: 100 }
    }
  })

  const render = () => {
    // if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
    //   canvas.height = window.innerHeight
    //   canvas.width = window.innerWidth
    //   gl.viewport(0, 0, canvas.width, canvas.height)
    //   projectionMatrix = getProjection()
    // }
    // camera.processDesktopInput(refs.di)

    Composite.translate(engine.world, { x: -0.2 * refs.deltaT, y: 0 })
    if (coin.position.x < -1060) {
      // miss coin
      coin.position = { x: 960 + 100 * Math.floor(Math.random() * 10), y: 100 }
    }

    if (player.position.x < -960 || player.position.y < -180) {
      changeStage(GameStage.MainMenu)
    }

    Engine.update(engine, refs.deltaT)

    mat4.mul(viewProjection, projectionMatrix, camera.viewMatrix)
    // drawAxis({ viewProjection })
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
