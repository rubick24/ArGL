import { IAnimation } from './interfaces'
import { mat4 } from 'gl-matrix'
import {
  getInterpolationVec3,
  getInterpolationQuat
  // getInterpolationFloat
} from './getInterpolation'
import frameHooks from './frameHooks'

export default (animation: IAnimation) => {
  const startAt = performance.now()
  animation.channels.map(c => {
    c.targetNode.animationMatrix = mat4.create()
  })
  const af = (t: number) => {
    const at = (t - startAt) / 1000
    if (at > animation.duration) {
      frameHooks.beforeDraw.splice(
        frameHooks.beforeDraw.findIndex(v => v === af),
        1
      )
    }
    animation.channels.forEach(c => {
      if (at > c.duration) {
        return
      }
      const node = c.targetNode
      if (c.path === 'scale') {
        const v = getInterpolationVec3(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        mat4.scale(node.animationMatrix as mat4, node.animationMatrix as mat4, v)
      } else if (c.path === 'translation') {
        const v = getInterpolationVec3(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        mat4.translate(node.animationMatrix as mat4, node.animationMatrix as mat4, v)
      } else if (c.path === 'rotation') {
        const rotateAni = mat4.create()
        const v = getInterpolationQuat(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        mat4.fromQuat(rotateAni, v)
        mat4.mul(node.animationMatrix as mat4, node.animationMatrix as mat4, rotateAni)
      }
    })
  }
  frameHooks.beforeDraw.push(af)
}
