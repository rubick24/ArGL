import { createScene } from './scene/scene'
import { refs } from './refs'

const canvas = document.getElementById('main') as HTMLCanvasElement
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const gl = canvas.getContext('webgl2', {
  premultipliedAlpha: true,
  antialias: false,
  powerPreference: 'high-performance'
  // preserveDrawingBuffer: true
})
if (!gl) {
  throw new Error('webgl2 not available')
}
refs.gl = gl
gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
gl.clearColor(0, 0, 0, 0)

const scene = await createScene()

refs.lastT = performance.now()
const renderLoop = (time: number) => {
  refs.time = time
  refs.deltaT = time - refs.lastT

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  scene.render()

  refs.lastT = time
  requestAnimationFrame(renderLoop)
}
requestAnimationFrame(renderLoop)
