import { IAccessor, IAnimationCannel, IAnimation, INode } from './interfaces'
import { GlTF } from '../types/glTF'
import frameHooks from './frameHooks'
import { mat4 } from 'gl-matrix'

export default (json: GlTF, accessors: IAccessor[], nodes: INode[]) => {
  if (!json.animations) {
    return []
  }
  const animations = json.animations.map(
    (a): IAnimation => {
      const channels = a.channels.reduce((res, c) => {
        if (c.target.node === undefined || json.accessors === undefined) {
          return res
        }
        const sampler = a.samplers[c.sampler]
        const inputAccessor = accessors[sampler.input]
        const outputAccessor = accessors[sampler.output]
        if (inputAccessor.max === undefined || inputAccessor.min === undefined) {
          return res
        }
        const duration = inputAccessor.max[0]
        if (duration <= 0) {
          return res
        }

        const interval = duration / inputAccessor.bufferData.length
        res.push({
          targetNode: nodes[c.target.node],
          path: c.target.path,
          duration: duration,
          interval,
          inputAccessor,
          outputAccessor,
          interpolation: sampler.interpolation
        })
        return res
      }, [] as IAnimationCannel[])
      return {
        name: a.name || '',
        channels,
        duration: channels.reduce((p, v) => Math.max(p, v.duration), 0)
      }
    }
  )

  frameHooks.beforeDraw.push(() => {
    nodes.forEach(n => {
      if (n.animationMatrix) {
        mat4.identity(n.animationMatrix)
      }
    })
  })

  return animations
}
