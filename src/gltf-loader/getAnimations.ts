import { IAccessor, IAnimationCannel, IAnimation } from './interfaces'
import { GlTF } from '../types/glTF'
import { getInterpolationVec3, getInterpolationQuat, getInterpolationFloat } from './getInterpolation'

export default (json: GlTF, accessors: IAccessor[]) => {

  if (!json.animations) {
    return []
  }
  const animationsJson = json.animations
  const animations = animationsJson.map((a, i): IAnimation => {
    const frameRate = 60
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
      const duration = inputAccessor.max[0] - inputAccessor.min[0]
      if (duration > 0) {
        const frameCount = Math.round(duration * frameRate) // TODO: improve this
        let data: Float32Array | null = null
        switch (c.target.path) {
          case 'scale':
          case 'translation':
            data = new Float32Array(frameCount * 3)
            for (let i=0;i<frameCount;i+=1) {
              const v = getInterpolationVec3(inputAccessor, outputAccessor, sampler.interpolation, i / frameRate)
              data[i*3] = v[0]
              data[i*3+1] = v[1]
              data[i*3+2] = v[2]
            }
            break
          case 'rotation':
            data = new Float32Array(frameCount * 4)
            for (let i=0;i<frameCount;i+=1) {
              const v = getInterpolationQuat(inputAccessor, outputAccessor, sampler.interpolation, i / frameRate)
              data[i*4] = v[0]
              data[i*4+1] = v[1]
              data[i*4+2] = v[2]
              data[i*4+3] = v[3]
            }
            break
          case 'weights':
            data = new Float32Array(frameCount)
            for (let i=0;i<frameCount;i+=1) {
              const v = getInterpolationFloat(inputAccessor, outputAccessor, sampler.interpolation, i / frameRate)
              data[i] = v
            }
            break
          default:
            break
        }
        if (data) {
          res.push({
            targetNodeIndex: c.target.node,
            path: c.target.path,
            startAt: inputAccessor.min[0],
            endAt: inputAccessor.max[0],
            data
          })
        }
      }
      return res
    }, [] as IAnimationCannel[])
    return {
      name: a.name || '',
      frameRate,
      triggerStart: false,
      startAt: -1,
      channels
    }
  })


  return animations
}
