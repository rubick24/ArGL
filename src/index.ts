import { loadGLTF, render }  from './gltf-loader/index'
import ArcRotateCamera from './camera/ArcRotateCamera'
import DesktopInput from './input/DesktopInput'
import { vec3 } from 'gl-matrix'

const canvas = document.getElementById('main') as HTMLCanvasElement
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const gl = canvas.getContext('webgl2', { premultipliedAlpha: false })
if (!gl) {
  throw new Error('webgl2 not available')
}
gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)

const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 5)
const di = new DesktopInput(canvas)

const start = async () => {
  const { scenes, meshes } = await loadGLTF('/suzanne.gltf', gl)

  gl.clearColor(0, 0, 0, 0)
  const renderLoop = (time: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    camera.processDesktopInput(di)
    render(gl, scenes[0], camera)
    requestAnimationFrame(renderLoop)
  }
  requestAnimationFrame(renderLoop)
}

start()
