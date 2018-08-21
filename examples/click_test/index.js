import { ArGL, Camera, Shader } from './../../dist/argl'
import * as glm from 'gl-matrix'

import Ray from './ray'

import vs from './shader/ct.vs'
import fs from './shader/ct.fs'

import suzanneObj from './assets/suzanne.obj'

let argl = new ArGL({
  width: 960,
  height: 540,
  desktopInput: {
    lockPointer: false
  }
})
document.body.appendChild(argl.el)

let gl = argl.gl
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)

let camera = new Camera(glm.vec3.fromValues(0.0, 0.0, 5.0))
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
let suzan_s_vao = argl.setMeshVAO(suzanneMesh, shader)


let model, view, projection

//
argl.canvas.addEventListener('mousemove', e => {

  let angleY = -((e.offsetY * camera.zoom / argl.options.height) - (camera.zoom / 2))
  let zoomX = (camera.zoom / argl.options.height) * argl.options.width
  let angleX = (e.offsetX * zoomX / argl.options.width) - (zoomX / 2)
  //console.log('angle X,Y:', angleX, angleY)

  let normalFR = glm.vec3.create()
  glm.vec3.cross(normalFR, camera.front, camera.right)
  glm.vec3.normalize(normalFR, normalFR)

  let direction = rotateVec(camera.front, normalFR, glm.glMatrix.toRadian(angleX))

  let normalFU = glm.vec3.create()
  glm.vec3.cross(normalFU, direction, camera.up)
  glm.vec3.normalize(normalFU, normalFU)

  direction = rotateVec(direction, normalFU, glm.glMatrix.toRadian(angleY))

  // console.log('⭐ direction:', direction)
  let ray = new Ray(camera.position, direction)
  let flag = false
  let len = suzanneMesh.indices.length

  for (let i = 0; i < len; i += 3) {
    let index = [suzanneMesh.indices[i], suzanneMesh.indices[i + 1], suzanneMesh.indices[i + 2]]
    let triangle = [glm.vec3.create(), glm.vec3.create(), glm.vec3.create()]
    glm.vec3.transformMat4(triangle[0], [suzanneMesh.vertices[index[0] * 3], suzanneMesh.vertices[index[0] * 3 + 1], suzanneMesh.vertices[index[0] * 3 + 2]], model)
    glm.vec3.transformMat4(triangle[1], [suzanneMesh.vertices[index[1] * 3], suzanneMesh.vertices[index[1] * 3 + 1], suzanneMesh.vertices[index[1] * 3 + 2]], model)
    glm.vec3.transformMat4(triangle[2], [suzanneMesh.vertices[index[2] * 3], suzanneMesh.vertices[index[2] * 3 + 1], suzanneMesh.vertices[index[2] * 3 + 2]], model)

    if (ray.intersectsTriangle(triangle)) {
      flag = true
    }
  }
  hover = flag
  //console.log('flag:', flag)
})

let hover = false

argl.start()

gl.clearColor(0, 0, 0, 1)


argl.draw = (time) => {

  // camera.desktopFreeMoveControl(argl)
  processInput()

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  model = glm.mat4.create()
  view = camera.getViewMatrix()
  projection = glm.mat4.create()
  glm.mat4.perspective(projection, glm.glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)

  shader.use()
  shader.setMat4('u_projection', projection)
  shader.setMat4('u_view', view)
  shader.setMat4('u_model', model)
  shader.setBool('u_hover', hover)
  argl.drawMesh(suzanneMesh, suzan_s_vao)
}

function processInput() {
  if (argl.currentlyPressedKeys.get('w')) {
    camera.processMove(Camera.Movement.FORWARD, argl.deltaTime)
  }
  if (argl.currentlyPressedKeys.get('s')) {
    camera.processMove(Camera.Movement.BACKWARD, argl.deltaTime)
  }
  if (argl.currentlyPressedKeys.get('a')) {
    camera.processMove(Camera.Movement.LEFT, argl.deltaTime)
  }
  if (argl.currentlyPressedKeys.get('d')) {
    camera.processMove(Camera.Movement.RIGHT, argl.deltaTime)
  }
  if (argl.currentlyPressedKeys.get(' ')) {
    camera.processMove(Camera.Movement.UP, argl.deltaTime)
  }
  if (argl.currentlyPressedKeys.get('Shift')) {
    camera.processMove(Camera.Movement.DOWN, argl.deltaTime)
  }
  // camera.processViewAngle(argl.mouseInput.deltaX, -argl.mouseInput.deltaY)
  camera.processZoom(argl.mouseInput.wheelDeltaY)
}

function rotateVec(vec, normal, angle) {
  let direction = glm.vec3.create()
  let t1 = glm.vec3.create()
  let t2 = glm.vec3.create()

  glm.vec3.normalize(normal, normal)

  glm.vec3.scale(t1, vec, Math.cos(angle))
  glm.vec3.cross(t2, normal, vec)
  glm.vec3.scale(t2, t2, Math.sin(angle))
  glm.vec3.add(direction, t1, t2)

  return direction
}
