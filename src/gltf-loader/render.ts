import { IScene, INode, ComputeJoints } from './interfaces'
import draw from './draw'
import { mat4 } from 'gl-matrix'
import ArcRotateCamera from '../camera/ArcRotateCamera'

import frameHooks from './frameHooks'

const firstModelMatrix = mat4.create() as Float32Array
let projectionMatrix: mat4 | null = null

export default (gl: WebGL2RenderingContext, nodes: INode[], computeJoints: ComputeJoints) => {
  const renderNode = (camera: ArcRotateCamera, node: INode, modelMatrix: mat4) => {
    mat4.copy(node.worldTransform, modelMatrix)
    mat4.invert(node.inverseWorldTransform, node.worldTransform)
    mat4.mul(node.tempMatrix, node.worldTransform, node.matrix)
    mat4.mul(node.tempMatrix, node.tempMatrix, node.localTransform)

    if (node.mesh) {
      draw(gl)(node, camera.viewMatrix, projectionMatrix as mat4)
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

    nodes.forEach(node => {
      // 计算蒙皮
      if(node.mesh !== undefined && node.skin !== undefined) {
        computeJoints(node.skin, node)
      }
      // 重置动画矩阵？
      mat4.identity(node.localTransform)
    })

    frameHooks.beforeDraw.map(v => v(time))

    scene.nodes.forEach(node => {
      renderNode(camera, node, firstModelMatrix)
    })

    frameHooks.afterDraw.map(v => v(time))
  }
}
