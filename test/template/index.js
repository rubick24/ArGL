import { ArGL, OrbitCamera, Shader } from './../../dist/argl'
import { mat4, glMatrix } from 'gl-matrix'

import vs from './shader/tc.vs'
import fs from './shader/tc.fs'

import suzanneObj from '../assets/suzanne.obj'

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

let camera = new OrbitCamera([4, 4, 4], [0, 0, 0])
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
let suzan_s_vao = argl.setMeshVAO(suzanneMesh, shader)

argl.start()

gl.clearColor(0, 0, 0, 1)

argl.draw = (time) => {

  camera.desktopOrbitControl(argl)
  camera.mobileOrbitControl(argl)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let model = mat4.create()
  let view = camera.getViewMatrix()
  let projection = mat4.perspective([], glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)
  shader.use()
  shader.setMat4('u_projection', projection)
  shader.setMat4('u_view', view)
  shader.setMat4('u_model', model)
  argl.drawMesh(suzanneMesh, suzan_s_vao)
}


