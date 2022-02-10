import { IScene, INode, ComputeJoints } from './interfaces'
import createDraw from './draw'
import { mat4 } from 'gl-matrix'
import { ArcRotateCamera } from '../camera/ArcRotateCamera'

import frameHooks from './frameHooks'

const rootTransform = mat4.create() as Float32Array
let projectionMatrix: mat4 | null = null

export default (gl: WebGL2RenderingContext, nodes: INode[], computeJoints: ComputeJoints) => {
  const applyTransform = (node: INode, parentTransform: mat4) => {
    const t = mat4.create()
    mat4.fromRotationTranslationScale(t, node.rotation, node.translation, node.scale)
    mat4.mul(node.worldTransform, parentTransform, t)
    mat4.invert(node.inverseWorldTransform, node.worldTransform)
    if (node.children) {
      node.children.forEach(child => {
        applyTransform(child, node.worldTransform)
      })
    }
  }

  const draw = createDraw(gl)
  const renderNode = (camera: ArcRotateCamera, node: INode) => {
    if (node.mesh) {
      draw(node, camera.viewMatrix, projectionMatrix as mat4)
    }
    if (node.children) {
      node.children.forEach(child => {
        renderNode(camera, child)
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

    scene.nodes.forEach(node => applyTransform(node, rootTransform))

    nodes.forEach(node => {
      // 计算蒙皮
      if (node.mesh !== undefined && node.skin !== undefined) {
        computeJoints(node.skin, node)
      }
    })

    scene.nodes.forEach(node => renderNode(camera, node))

    frameHooks.afterDraw.map(v => v(time))
  }
}
