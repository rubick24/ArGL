import { IAccessor, IAnimationCannel, IAnimation, INode } from './interfaces'
import { GlTF } from '../types/glTF'
import animate from './animate'

export default (json: GlTF, accessors: IAccessor[], nodes: INode[]) => {
  if (!json.animations) {
    return []
  }
  const animations = json.animations.map((a): IAnimation => {
    const targetNodes: {
      node: INode
      channels: IAnimationCannel[]
    }[] = []
    a.channels.forEach(c => {
      if (c.target.node === undefined || json.accessors === undefined) {
        return
      }
      const sampler = a.samplers[c.sampler]
      const inputAccessor = accessors[sampler.input]
      const outputAccessor = accessors[sampler.output]
      if (inputAccessor.max === undefined || inputAccessor.min === undefined) {
        return
      }
      const duration = inputAccessor.max[0]
      if (duration <= 0) {
        return
      }

      const interval = duration / inputAccessor.bufferData.length

      let targetNodeIndex = targetNodes.findIndex(v => v.node === nodes[c.target.node as number])
      if (targetNodeIndex < 0) {
        targetNodeIndex = targetNodes.length
        targetNodes.push({
          node: nodes[c.target.node],
          channels: []
        })
      }

      targetNodes[targetNodeIndex].channels.push({
        targetNode: nodes[c.target.node],
        path: c.target.path,
        duration: duration,
        interval,
        inputAccessor,
        outputAccessor,
        interpolation: sampler.interpolation
      })
    })
    return {
      name: a.name || '',
      targetNodes,
      duration: targetNodes.reduce(
        (p, v) =>
          Math.max(
            p,
            v.channels.reduce((pi, vi) => Math.max(pi, vi.duration), 0)
          ),
        0
      )
    }
  })

  return animations.map(a => animate(a))
}
