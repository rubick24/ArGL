import loadGLTF from './gltf-loader/index'
import ArcRotateCamera from './camera/ArcRotateCamera'
import DesktopInput from './input/DesktopInput'
import { vec3 } from 'gl-matrix'
import createParticles from './particle/particle'
import axis from './axis/axis'

const canvas = document.getElementById('main') as HTMLCanvasElement
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const gl = canvas.getContext('webgl2', { premultipliedAlpha: true })
if (!gl) {
  throw new Error('webgl2 not available')
}
gl.viewport(0, 0, canvas.width, canvas.height)

gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

// TODO: read camera setting in glTF
const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 10)
const di = new DesktopInput(canvas)

const start = async () => {
  const { json, scenes, render, animations, animate } = await loadGLTF('/ybot.glb', gl)

  setInterval(() => {
    animate(animations[0])
  }, animations[0].duration * 1000)

  const snow = await createParticles(gl, {
    texture: './particle.png',
    scale: 1,
    numParticles: 1e4,
    particleBirthRate: 500,
    originA: [4, 3, -4],
    originB: [-4, 3, 4],
    angle: [0, -1, 0],
    angleRadius: Math.PI / 4,
    speedRange: [0.3, 0.6],
    gravity: [0, 0, 0],
    ageRange: [29, 30],
  })
  const projectionMatrix = camera.getProjectionMatrix(
    gl.canvas.width / gl.canvas.height,
    0.01,
    1000
  )
  const drawAxis = await axis(gl)

  gl.clearColor(0, 0, 0, 0)
  const renderLoop = (time: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if (window.innerHeight !== canvas.height || window.innerWidth !== canvas.width) {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    camera.processDesktopInput(di)
    drawAxis({ viewMatrix: camera.viewMatrix, projectionMatrix })
    render(scenes[0], camera, time)

    snow({ time, viewMatrix: camera.viewMatrix, projectionMatrix })
    requestAnimationFrame(renderLoop)
  }
  requestAnimationFrame(renderLoop)
}

start()
