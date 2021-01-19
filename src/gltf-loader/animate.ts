import { IAnimation } from './interfaces'

import {
  getLerpVec3,
  getLerpQuat
  // getLerpFloat
} from './getLerp'
import frameHooks from './frameHooks'

export default (animation: IAnimation) => {

  const af = (t: number) => {
    const at = (t - ani.startAt) / 1000
    if (at > animation.duration) {
      const index = frameHooks.beforeDraw.findIndex(v => v === af)
      if (index > -1) {
        frameHooks.beforeDraw.splice(index, 1)
      }
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
  // frameHooks.beforeDraw.push(af)

  const ani = {
    startAt: performance.now(),
    pauseAt: 0,
    finished: false,
    reset() {
      this.finished = false
      this.startAt = performance.now()
      const index = frameHooks.beforeDraw.findIndex(v => v === af)
      if (index > -1) {
        frameHooks.beforeDraw.splice(index, 1)
      }
      frameHooks.beforeDraw.push(af)
    },
    play() {
      const index = frameHooks.beforeDraw.findIndex(v => v === af)
      if (index > -1) {
        return
      }
      this.startAt = performance.now() - this.pauseAt
      this.pauseAt = 0
      frameHooks.beforeDraw.push(af)
    },
    pause() {
      const index = frameHooks.beforeDraw.findIndex(v => v === af)
      if (index > -1) {
        frameHooks.beforeDraw.splice(index, 1)
        this.pauseAt = performance.now() - this.startAt
      }
    }
  }
  return ani
}
