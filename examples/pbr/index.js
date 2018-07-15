import { ArGL, Camera, Shader } from './../../src/index'
import * as glm from 'gl-matrix'

import vs from './shader/pbr.vs'
import fs from './shader/pbr.fs'

import suzanneObj from './assets/suzanne.obj'

import normalImg from './assets/rustediron2_normal.png'
import baseColorImg from './assets/rustediron2_basecolor.png'
import metallicImg from './assets/rustediron2_metallic.png'
import roughnessImg from './assets/rustediron2_roughness.png'


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
gl.clearColor(0, 0, 0, 1.0)

let camera = new Camera(glm.vec3.fromValues(0.0, 0.0, 5.0))
let shader = new Shader(gl, vs, fs)

let suzanneMesh = argl.loadMesh(suzanneObj)
suzanneMesh.setVAO(shader)

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
argl.draw = (time)=>{
  processInput()

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let view = camera.getViewMatrix()
  shader.use()
  shader.setMat4('u_view', view)
  let projection = glm.mat4.create()
  glm.mat4.perspective(projection, glm.glMatrix.toRadian(camera.zoom), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)
  shader.setMat4('u_projection', projection)
  shader.setVec3('u_camPos', camera.position)

  let model = glm.mat4.create()
  shader.setMat4('u_model', model)
  suzanneMesh.draw()

  for (let i = 0; i < lightPositions.length; ++i) {
    let newPos = lightPositions.slice(i * 3, i * 3 + 3)
    //glm.vec3.add(newPos, lightPositions.slice(i*3,i*3+3), [5, 0, 0])
    shader.setVec3('lightPositions[' + i + ']', newPos)
    shader.setVec3('lightColors[' + i + ']', lightColors.slice(i * 3, i * 3 + 3))
    let model = glm.mat4.create()
    glm.mat4.translate(model, model, newPos)
    glm.mat4.scale(model, model, 0.1)
    shader.setMat4('u_model', model)

    suzanneMesh.draw()
  }
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
