import { IScene, INode } from './interfaces'
import draw from './draw'
import { vec3, mat4 } from 'gl-matrix'
import ArcRotateCamera from '../camera/ArcRotateCamera'

const firstModelMatrix = mat4.create() as Float32Array

// TODO read camera setting in glTF
// const camera = new ArcRotateCamera(vec3.fromValues(0, 0, 0), Math.PI / 2, Math.PI / 2, 5)

export default (gl: WebGL2RenderingContext, scene: IScene, camera: ArcRotateCamera) => {
  if (!scene.nodes) {
    return
  }

  const projectionMatrix = camera.getProjectionMatrix(
    gl.canvas.width / gl.canvas.height,
    0.1,
    1000
  )
  const renderNode = (node: INode, modelMatrix: Float32Array) => {
    mat4.mul(node.tempMatrix, modelMatrix, node.matrix)
    if (node.mesh) {
      draw(gl, node.mesh, node.tempMatrix, camera.viewMatrix, projectionMatrix, camera.position)
    }
    if (node.children) {
      node.children.forEach(child => {
        renderNode(child, node.tempMatrix)
      })
    }
  }

  scene.nodes.forEach(node => {
    renderNode(node, firstModelMatrix)
  })
}
