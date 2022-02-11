import { Engine } from 'matter-js'
import { DesktopInput } from './input/DesktopInput'

const bannerGameEl = document.getElementById('banner-game') as HTMLDivElement
bannerGameEl.style.height = (bannerGameEl.clientWidth / 1920) * 360 + 'px'
const canvas = document.getElementById('main') as HTMLCanvasElement
const gl = canvas.getContext('webgl2', {
  premultipliedAlpha: true,
  antialias: false
  // powerPreference: 'high-performance'
  // preserveDrawingBuffer: true
})
if (!gl) {
  throw new Error('webgl2 not available')
}

gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
// gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
gl.clearColor(0, 0, 0, 0)

const di = DesktopInput.getInstance(gl.canvas)

export const GameStage = {
  MainMenu: 0,
  InGame: 1,
  Paused: 2
}
const stageLength = Object.keys(GameStage).length

const transformMap: {
  enter: Function[][]
  leave: Function[][]
} = {
  enter: new Array(stageLength).fill(0).map(v => new Array()),
  leave: new Array(stageLength).fill(0).map(v => new Array())
}

export const changeStage = (newStage: number) => {
  if (refs.gameStage === newStage) {
    return
  }
  transformMap.leave[refs.gameStage].forEach(fn => fn())
  refs.gameStage = newStage
  transformMap.enter[newStage].forEach(fn => fn())
}

const scoreEl = document.querySelector('#banner-game .score') as HTMLSpanElement
const startEl = document.querySelector('#banner-game .start') as HTMLButtonElement

startEl.onclick = () => {
  canvas.focus()
  changeStage(GameStage.InGame)
}
transformMap.enter[GameStage.MainMenu].push(() => {
  startEl.style.display = 'block'
})
transformMap.leave[GameStage.MainMenu].push(() => {
  startEl.style.display = 'none'
})

let gameStateScore = 0
const gameState = {
  duration: 0,
  get score() {
    return gameStateScore
  },
  set score(v) {
    gameStateScore = v
    scoreEl.innerText = v.toString()
  }
}

export const refs = {
  debug: true,
  canvas,
  gl,
  engine: Engine.create(),
  di,
  deltaT: 0,
  lastT: 0,
  time: 0,

  gameStage: GameStage.MainMenu,
  transformMap,
  gameState
}
