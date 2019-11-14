import Shader from './shader'
import vsSource from './main.vert'
import fsSource from './main.frag'

const canvas = document.getElementById('main') as HTMLCanvasElement
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const gl = canvas.getContext('webgl2', { premultipliedAlpha: false })
if (!gl) {
  throw new Error('webgl2 not available')
}
gl.viewport(0, 0, canvas.width, canvas.height)
const shader = new Shader(gl, vsSource, fsSource)
shader.use()
const quad = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]
const quadVAO = gl.createVertexArray()
const quadVBO = gl.createBuffer()
gl.bindVertexArray(quadVAO)
gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW)
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
gl.bindBuffer(gl.ARRAY_BUFFER, null)
// gl.bindVertexArray(null)

shader.setUniform('iResolution', 'VEC2', [canvas.clientWidth, canvas.clientHeight])
const handleGlobalClick = (e: MouseEvent) => {
  shader.setUniform('iMouse', 'VEC2', [e.clientX, e.clientY])
}
window.addEventListener('click', handleGlobalClick)

gl.clearColor(0, 0, 0, 0)
const renderLoop = (time: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    shader.setUniform('iResolution', 'VEC2', [canvas.clientWidth, canvas.clientHeight])
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  shader.setUniform('iTime', 'FLOAT', time)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  requestAnimationFrame(renderLoop)
}
renderLoop(0)
