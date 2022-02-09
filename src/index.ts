import { createScene } from './scene/scene'
import { refs } from './refs'

const { canvas, gl } = refs
const scene = await createScene()

enum AppState {
  MainMenu,
  InGame,
  Paused
}
let raf = NaN
let gameStage = AppState.InGame
refs.lastT = performance.now()
const renderLoop = (time: number) => {
  refs.time = time
  refs.deltaT = Math.min(time - refs.lastT, 100)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  if (gameStage === AppState.InGame) {
    scene.render()
  }

  refs.lastT = time
  raf = requestAnimationFrame(renderLoop)
}
raf = requestAnimationFrame(renderLoop)

canvas.addEventListener('blur', e => {
  console.log('blur')
  if (gameStage === AppState.InGame) {
    gameStage = AppState.Paused
    cancelAnimationFrame(raf)
  }
})
canvas.addEventListener('focus', e => {
  console.log('focus')
  if (gameStage === AppState.Paused) {
    gameStage = AppState.InGame
    refs.lastT = performance.now()
    raf = requestAnimationFrame(renderLoop)
  }
})
window.addEventListener('visibilitychange', e => {
  console.log('visibilitychange', document.visibilityState)
  if (document.visibilityState === 'hidden') {
    if (gameStage === AppState.InGame) {
      gameStage = AppState.Paused
      cancelAnimationFrame(raf)
    }
  }
})
