import { ArGL, Camera, Shader } from './../../src/index'
import * as glm from 'gl-matrix'

import depthVs from './shader/depth.vs'
import depthFs from './shader/depth.fs'
import vs from './shader/shadow_mapping.vs'
import fs from './shader/shadow_mapping.fs'

import suzanneObj from './assets/suzanne.obj'
import planeObj from './assets/plane.obj'

let width = 960
let height = 540
let argl = new ArGL({
  width: width,
  height: height
})
document.body.appendChild(argl.el)

let gl = argl.gl
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)

let camera = new Camera(glm.vec3.fromValues(0.0, 0.0, 5.0))
let shadow_depth_shader = new Shader(gl, depthVs, depthFs)
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
suzanneMesh.setVAO(shadow_depth_shader)
suzanneMesh.setVAO(shader)

let planeMesh = argl.loadMesh(planeObj)
planeMesh.setVAO(shadow_depth_shader)
planeMesh.setVAO(shader)


// create a depth texture.
let depthTexture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, depthTexture)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, width, height, 0,
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


  processInput()

  gl.cullFace(gl.FRONT)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // let view = camera.getViewMatrix()
  // let projection = glm.mat4.create()
  // glm.mat4.perspective(projection, glm.glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)

  shadow_depth_shader.use()
  shadow_depth_shader.setMat4('u_lightSpaceMatrix', lightSpaceMatrix)
  shadow_depth_shader.setMat4('u_model', glm.mat4.create())

  suzanneMesh.draw()

  let model = glm.mat4.create()
  glm.mat4.translate(model, model, [0, -1, 0])
  glm.mat4.scale(model, model, [2, 2, 2])
  shadow_depth_shader.setMat4('u_model', model)
  planeMesh.draw()
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
  suzanneMesh.draw()
  shader.setMat4('u_model', model)
  planeMesh.draw()



  // gl.disable(gl.DEPTH_TEST)
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  //argl.drawDepth(depthTexture)
}


function processInput() {
  if (argl.mobile) {
    let first = argl.ongoingTouches.find(touch => {
      return touch.identifier >= 0
    })

    // for(let i in movementStatus){
    //   if(movementStatus[i]){
    //     camera.processMove(Number(i)+1, argl.deltaTime)
    //   }
    // }

    if (first) {
      camera.processViewAngle(first.deltaX * 5, -first.deltaY * 5)
    }

  } else {
    if (argl.currentlyPressedKeys['w']) {
      camera.processMove(Camera.Movement.FORWARD, argl.deltaTime)
    }
    if (argl.currentlyPressedKeys['s']) {
      camera.processMove(Camera.Movement.BACKWARD, argl.deltaTime)
    }
    if (argl.currentlyPressedKeys['a']) {
      camera.processMove(Camera.Movement.LEFT, argl.deltaTime)
    }
    if (argl.currentlyPressedKeys['d']) {
      camera.processMove(Camera.Movement.RIGHT, argl.deltaTime)
    }
    if (argl.currentlyPressedKeys[' ']) {
      camera.processMove(Camera.Movement.UP, argl.deltaTime)
    }
    if (argl.currentlyPressedKeys['Shift']) {
      camera.processMove(Camera.Movement.DOWN, argl.deltaTime)
    }
    camera.processViewAngle(argl.mouseMovement.x, -argl.mouseMovement.y)
    camera.processMouseScroll(argl.wheelDeltaY)
  }

}
