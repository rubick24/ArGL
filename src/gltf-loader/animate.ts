import { IAnimation } from './interfaces'

import {
  getLerpVec3,
  getLerpQuat
  // getLerpFloat
} from './getLerp'
import frameHooks from './frameHooks'

export default (animation: IAnimation) => {
  const startAt = performance.now()

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
        if (c.path === 'translation') {
          getLerpVec3(tn.node.translation, c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'scale') {
          getLerpVec3(tn.node.scale, c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'rotation') {
          getLerpQuat(tn.node.rotation, c.inputAccessor, c.outputAccessor, c.interpolation, at)
        } else if (c.path === 'weights') {
          //
        }
      })
    })
  }
  frameHooks.beforeDraw.push(af)
}
