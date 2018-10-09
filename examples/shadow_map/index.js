import { ArGL, FreeMoveCamera, Shader } from './../../dist/argl'
import * as glm from 'gl-matrix'

import depthVs from './shader/depth.vs'
import depthFs from './shader/depth.fs'
import vs from './shader/shadow_mapping.vs'
import fs from './shader/shadow_mapping.fs'

import suzanneObj from './assets/suzanne.obj'
import planeObj from './assets/plane.obj'

let canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.height = 540
canvas.width = 960

let argl = new ArGL(canvas)
let gl = argl.gl
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)

let camera = new FreeMoveCamera([0.0, 0.0, 5.0], [0, 1, 0, 0])
let shadow_depth_shader = new Shader(gl, depthVs, depthFs)
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
let suzan_sds_vao = argl.setMeshVAO(suzanneMesh, shadow_depth_shader)
let suzan_s_vao = argl.setMeshVAO(suzanneMesh, shader)

let planeMesh = argl.loadMesh(planeObj)
let plane_sds_vao = argl.setMeshVAO(planeMesh, shadow_depth_shader)
let plane_s_vao = argl.setMeshVAO(planeMesh, shader)


// create a depth texture.
let depthTexture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, depthTexture)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, canvas.width, canvas.height, 0,
  gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)

// Create a framebuffer and attach the textures.
let fb = gl.createFramebuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
  gl.TEXTURE_2D, depthTexture, 0)

let lightPosition = [-4, 4, 4]
let near_plane = 1, far_plane = 15
let lightProjection = glm.mat4.create()
glm.mat4.ortho(lightProjection, -10, 10, -10, 10, near_plane, far_plane)
let lightView = glm.mat4.create()
glm.mat4.lookAt(lightView, lightPosition, [0, 0, 0], [0, 1, 0])
let lightSpaceMatrix = glm.mat4.create()
glm.mat4.mul(lightSpaceMatrix, lightProjection, lightView)

shader.use()
shader.setInt('shadowMap', 0)
shader.setVec3('u_diffuseColor', [0, 0.5, 1])

argl.start()

gl.clearColor(0, 0, 0, 1)

argl.draw = (time) => {

  let step = argl.deltaTime * 0.005
  camera.desktopFreeMoveControl(argl.currentlyPressedKeys, step, argl.mouseInput, 0.05)

  gl.cullFace(gl.FRONT)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  shadow_depth_shader.use()
  shadow_depth_shader.setMat4('u_lightSpaceMatrix', lightSpaceMatrix)
  shadow_depth_shader.setMat4('u_model', glm.mat4.create())

  argl.drawMesh(suzanneMesh, suzan_sds_vao)

  let model = glm.mat4.create()
  glm.mat4.translate(model, model, [0, -1, 0])
  glm.mat4.scale(model, model, [2, 2, 2])
  shadow_depth_shader.setMat4('u_model', model)
  argl.drawMesh(planeMesh, plane_sds_vao)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.cullFace(gl.BACK)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let view = camera.getViewMatrix()
  let projection = glm.mat4.create()
  glm.mat4.perspective(projection, glm.glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)
  shader.use()
  shader.setMat4('u_projection', projection)
  shader.setMat4('u_view', view)
  shader.setMat4('u_model', glm.mat4.create())
  shader.setVec3('u_viewPos', camera.position)
  shader.setVec3('u_lightPos', lightPosition)
  shader.setMat4('u_lightSpaceMatrix', lightSpaceMatrix)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, depthTexture)
  argl.drawMesh(suzanneMesh, suzan_s_vao)

  shader.setMat4('u_model', model)
  argl.drawMesh(planeMesh, plane_s_vao)

}


