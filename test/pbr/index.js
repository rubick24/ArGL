
import { ArGL, OrbitCamera, FreeMoveCamera, Shader } from '../../dist/argl'

import { mat4, glMatrix } from 'gl-matrix'

import vs from './shader/pbr.vs'
import fs from './shader/pbr.fs'

import suzanneObj from '../assets/suzanne.obj'

import normalImg from '../assets/rustediron2_normal.png'
import baseColorImg from '../assets/rustediron2_basecolor.png'
import metallicImg from '../assets/rustediron2_metallic.png'
import roughnessImg from '../assets/rustediron2_roughness.png'

let canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.style.margin = '0'
document.body.style.overflow = 'hidden'

let argl = new ArGL(canvas, {
  desktopInput: {
    lockPointer: false
  }
})

let gl = argl.gl
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)
gl.clearColor(0, 0, 0, 1.0)

let camera = new OrbitCamera([4, 4, 4], [0, 0, 0])
// let camera = new FreeMoveCamera([0.0, 0.0, 5.0], [0, 1, 0, 0])
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
let suzan_s_vao = argl.setMeshVAO(suzanneMesh, shader)

let lightPositions = [
  -10.0, 10.0, 10.0,
  10.0, 10.0, 10.0,
  -10.0, -10.0, 10.0,
  10.0, -10.0, 10.0,
]
let lightColors = [
  300.0, 300.0, 300.0,
  300.0, 300.0, 300.0,
  300.0, 300.0, 300.0,
  300.0, 300.0, 300.0
]

// canvas.addEventListener('progress', function (e) {
//   console.log('progress: '+e.detail)
// }, false);

let images = [baseColorImg, normalImg, metallicImg, roughnessImg]
argl.setImageResource(images)
// argl.textures will be available in draw function

gl.enable(gl.DEPTH_TEST)
shader.use()
shader.setInt('albedoMap', 0)
shader.setInt('normalMap', 1)
shader.setInt('metallicMap', 2)
shader.setInt('roughnessMap', 3)


argl.start()


// draw loop
//------------
argl.draw = (time) => {

  camera.desktopOrbitControl(argl)
  camera.mobileOrbitControl(argl)

  // let step = argl.deltaTime * 0.005
  // camera.desktopFreeMoveControl(argl, step, 0.05)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let view = camera.getViewMatrix()
  shader.use()
  shader.setMat4('u_view', view)
  let projection =  mat4.perspective([], glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)
  shader.setMat4('u_projection', projection)
  shader.setVec3('u_camPos', camera.position)

  let model = mat4.create()
  shader.setMat4('u_model', model)
  argl.drawMesh(suzanneMesh, suzan_s_vao)

  for (let i = 0; i < lightPositions.length; ++i) {
    let newPos = lightPositions.slice(i * 3, i * 3 + 3)
    shader.setVec3('lightPositions[' + i + ']', newPos)
    shader.setVec3('lightColors[' + i + ']', lightColors.slice(i * 3, i * 3 + 3))
    let model = mat4.fromTranslation([], newPos)
    mat4.scale(model, model, 0.1)
    shader.setMat4('u_model', model)

    argl.drawMesh(suzanneMesh)
  }
}

