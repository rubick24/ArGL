import { createScene } from './scene/scene'

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
gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

const scene = await createScene(gl)

gl.clearColor(0, 0, 0, 0)
const renderLoop = (time: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  scene.render(time)
  requestAnimationFrame(renderLoop)
}
requestAnimationFrame(renderLoop)
