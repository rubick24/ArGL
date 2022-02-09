import { Engine } from 'matter-js'
import { DesktopInput } from './input/DesktopInput'

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

gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
// gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
gl.clearColor(0, 0, 0, 0)

const di = DesktopInput.getInstance(gl.canvas)

export const refs = {
  debug: true,
  canvas,
  gl,
  engine: Engine.create(),
  di,
  deltaT: 0,
  lastT: 0,
  time: 0
}
