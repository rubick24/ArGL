import { IScene, INode, IAnimation } from './interfaces'
import draw from './draw'
import { mat4 } from 'gl-matrix'
import ArcRotateCamera from '../camera/ArcRotateCamera'

const firstModelMatrix = mat4.create() as Float32Array

export default (gl: WebGL2RenderingContext, animations: IAnimation[]) => (
  scene: IScene,
  camera: ArcRotateCamera,
  time: number
) => {
  if (!scene.nodes) {
    return
  }

  animations.forEach(a => {
    if (a.triggerStart) {
      a.triggerStart = false
      a.startAt = time
    }
  })

  const projectionMatrix = camera.getProjectionMatrix(gl.canvas.width / gl.canvas.height, 0.1, 1000)
  const renderNode = (node: INode, modelMatrix: mat4) => {
    mat4.mul(node.tempMatrix, modelMatrix, node.matrix)

    animations.forEach(a => {
      if (a.startAt !== -1) {
        a.channels.forEach(c => {
          const acTiming = (time - a.startAt) / 1000 - c.startAt
          if (acTiming < 0 || acTiming > c.endAt) {
            return
          }
          const currentFrame = Math.round(a.frameRate * acTiming)
          if (c.targetNodeIndex === node.index) {
            if (c.path === 'scale') {
              const v = c.data.slice(currentFrame * 3, currentFrame * 3 + 3)
              mat4.scale(node.tempMatrix, node.tempMatrix, v.length ? v : [1, 1, 1])
            } else if (c.path === 'translation') {
              const v = c.data.slice(currentFrame * 3, currentFrame * 3 + 3)
              mat4.translate(node.tempMatrix, node.tempMatrix, v.length ? v : [0, 0, 0])
            } else if (c.path === 'rotation') {
              const rotateAni = mat4.create()
              const v = c.data.slice(currentFrame * 4, currentFrame * 4 + 4)
              mat4.fromQuat(rotateAni, v.length ? v : [0, 0, 0, 1])
              mat4.mul(node.tempMatrix, node.tempMatrix, rotateAni)
            }
          }
        })
      }
    })

    if (node.mesh) {
      draw(gl)(node.mesh, node.tempMatrix, camera.viewMatrix, projectionMatrix, camera.position)
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
