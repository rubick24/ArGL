import { IAnimation } from './interfaces'
import { mat4, quat, vec3 } from 'gl-matrix'
import {
  getLerpVec3,
  getLerpQuat
  // getLerpFloat
} from './getLerp'
import frameHooks from './frameHooks'

export default (animation: IAnimation) => {
  const startAt = performance.now()

  const transform = mat4.create()
  const trans = {
    scale: vec3.fromValues(1, 1, 1),
    translation: vec3.create(),
    rotation: quat.create()
  }

  const af = (t: number) => {
    const at = (t - startAt) / 1000
    if (at > animation.duration) {
      frameHooks.beforeDraw.splice(
        frameHooks.beforeDraw.findIndex(v => v === af),
        1
      )
      return
    }
    animation.targetNodes.forEach(tn => {
      tn.channels.forEach(c => {
        if (at > c.duration) {
          return
        }
        if (c.path === 'scale') {
          trans.scale = getLerpVec3(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'translation') {
          trans.translation = getLerpVec3(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'rotation') {
          trans.rotation = getLerpQuat(c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'weights') {
          console.log(1)
        }
      })
      mat4.fromRotationTranslationScale(
        transform,
        trans.rotation,
        trans.translation,
        trans.scale,
      )
      mat4.mul(tn.node.localTransform, tn.node.localTransform, transform)
    })
  }
  frameHooks.beforeDraw.push(af)
}
