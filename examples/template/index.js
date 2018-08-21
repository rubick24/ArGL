import { ArGL, Camera, Shader } from './../../dist/argl'
import * as glm from 'gl-matrix'

import vs from './shader/tc.vs'
import fs from './shader/tc.fs'

import suzanneObj from './assets/suzanne.obj'

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
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
let suzan_s_vao = argl.setMeshVAO(suzanneMesh, shader)

argl.start()

gl.clearColor(0, 0, 0, 1)

argl.draw = (time) => {

  processInput()

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let model = glm.mat4.create()
  let view = camera.getViewMatrix()
  let projection = glm.mat4.create()
  shader.use()
  shader.setMat4('u_projection', projection)
  shader.setMat4('u_view', view)
  shader.setMat4('u_model', model)
  argl.drawMesh(suzanneMesh, suzan_s_vao)
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
    camera.processViewAngle(argl.mouseInput.deltaX, -argl.mouseInput.deltaY)
    camera.processZoom(argl.mouseInput.wheelDeltaY)
  }

}
