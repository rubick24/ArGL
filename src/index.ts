import { createScene } from './scene/scene'
import { refs } from './refs'

const canvas = document.getElementById('main') as HTMLCanvasElement
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const gl = canvas.getContext('webgl2', {
  premultipliedAlpha: true,
  antialias: false
  // powerPreference: 'high-performance'
  // preserveDrawingBuffer: true
})
if (!gl) {
  throw new Error('webgl2 not available')
}
refs.gl = gl
gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
// gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
gl.clearColor(0, 0, 0, 0)

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
