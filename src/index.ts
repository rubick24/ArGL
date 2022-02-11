import { createScene } from './scene/scene'
import { refs, GameStage, changeStage } from './refs'

const { canvas, gl } = refs
const scene = await createScene()
scene.render()

let raf = NaN
refs.lastT = performance.now()
const renderLoop = (time: number) => {
  refs.time = time
  refs.deltaT = Math.min(time - refs.lastT, 100)
  raf = requestAnimationFrame(renderLoop)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  if (refs.gameStage === GameStage.InGame) {
    const state = refs.gameState
    state.duration += refs.deltaT
    if (Math.floor(state.duration / 1000) > state.score) {
      state.score = Math.floor(state.duration / 1000)
    }
    scene.render()
  }
  refs.lastT = time
}

refs.transformMap.enter[GameStage.InGame].push(() => {
  refs.lastT = performance.now()
  raf = requestAnimationFrame(renderLoop)
})
refs.transformMap.leave[GameStage.InGame].push(() => {
  cancelAnimationFrame(raf)
})

canvas.addEventListener('blur', () => {
  if (refs.gameStage === GameStage.InGame) {
    changeStage(GameStage.Paused)
  }
})
canvas.addEventListener('focus', () => {
  if (refs.gameStage === GameStage.Paused) {
    changeStage(GameStage.InGame)
  }
})
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (refs.gameStage === GameStage.InGame) {
      changeStage(GameStage.Paused)
    }
  }
})
