import { IScene, INode } from './interfaces'
import draw from './draw'
import { mat4 } from 'gl-matrix'
import ArcRotateCamera from '../camera/ArcRotateCamera'

import frameHooks from './frameHooks'

const firstModelMatrix = mat4.create() as Float32Array
let projectionMatrix: mat4 | null = null

export default (gl: WebGL2RenderingContext) => {
  const renderNode = (camera: ArcRotateCamera, node: INode, modelMatrix: mat4) => {
    mat4.mul(node.tempMatrix, modelMatrix, node.matrix)
    if (node.animationMatrix) {
      mat4.mul(node.tempMatrix, node.tempMatrix, node.animationMatrix)
    }
    if (node.mesh) {
      draw(gl)(
        node.mesh,
        node.tempMatrix,
        camera.viewMatrix,
        projectionMatrix as mat4,
        camera.position
      )
    }
    if (node.children) {
      node.children.forEach(child => {
        renderNode(camera, child, node.tempMatrix)
      })
    }
  }

  return (scene: IScene, camera: ArcRotateCamera, time: number) => {
    if (!scene.nodes) {
      return
    }

    if (!projectionMatrix) {
      projectionMatrix = camera.getProjectionMatrix(gl.canvas.width / gl.canvas.height, 0.1, 1000)
    }

    frameHooks.beforeDraw.map(v => v(time))

    scene.nodes.forEach(node => {
      renderNode(camera, node, firstModelMatrix)
    })

    frameHooks.afterDraw.map(v => v(time))
  }
}
